import CreatePostForm from "../components/CreatePostForm/CreatePostForm.jsx";

export default function NewPostPage() {
  return (
    <div className="p-4">
      <h1>New Post Page</h1>
      <CreatePostForm onCreated={(post) => console.log("created:", post)} />
    </div>
  );
}
