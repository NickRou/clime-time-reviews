import WriteReviewForm from "../../components/WriteReviewForm";

export default function WriteReviewPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-black">
        --- Write a Review ---
      </h1>
      <WriteReviewForm />
    </div>
  );
}
