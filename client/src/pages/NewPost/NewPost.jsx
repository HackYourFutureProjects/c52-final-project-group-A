import CreatePostForm from "../../components/CreatePostForm/CreatePostForm.jsx";

export default function NewPostPage() {
  return <CreatePostForm onCreated={(post) => console.log("created:", post)} />;
}
