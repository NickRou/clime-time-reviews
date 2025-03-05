import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import {
  createDbUser,
  deleteDbUser,
  isUserVerified,
  updateDbUser,
} from '@/actions/users'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error(
      'Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local'
    )
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // get data from event
  const { id, username, first_name, last_name, image_url } =
    evt.data as UserJSON
  const eventType = evt.type

  if (eventType === 'user.created') {
    if (!id || !username || !first_name || !last_name || !image_url) {
      return new Response('Error: User data is missing', {
        status: 400,
      })
    }
    await createDbUser({
      user_id: id,
      username,
      first_name,
      last_name,
      image_url,
      is_verified: false, // user is not verified by default
    })
  } else if (eventType === 'user.updated') {
    if (!id || !username || !first_name || !last_name || !image_url) {
      return new Response('Error: User data is missing', {
        status: 400,
      })
    }

    const isVerified = await isUserVerified(id)

    await updateDbUser({
      user_id: id,
      username,
      first_name,
      last_name,
      image_url,
      is_verified: isVerified,
    })
  } else if (eventType === 'user.deleted') {
    await deleteDbUser(id)
  }

  return new Response('Webhook received', { status: 200 })
}
