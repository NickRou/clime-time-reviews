import WriteReviewForm from "../../components/WriteReviewForm";

export default function WriteReviewPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <h1 className="sm:text-4xl md:text-4xl lg:text-4xl xl:text-4xl  font-bold text-center mb-12 text-black">
        --- Write a Review ---
      </h1>
      <WriteReviewForm />
    </div>
  );
}
