import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Post from "../components/Post";

const postModules = import.meta.glob("../data/posts/*.js");

export default function PostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState(null);
  const fromScene = location.state?.fromScene;

  useEffect(() => {
    let isMounted = true;

    const loadPost = async () => {
      for (const moduleLoader of Object.values(postModules)) {
        const module = await moduleLoader();
        const match = Object.values(module.posts ?? {}).find(
          (candidate) => candidate.id === postId,
        );

        if (match) {
          if (isMounted) {
            setPost(match);
          }
          return;
        }
      }

      if (isMounted) {
        setPost(null);
      }
    };

    loadPost();

    return () => {
      isMounted = false;
    };
  }, [postId]);

  const handleBackClick = () => {
    if (fromScene) {
      navigate(`/r/${fromScene}`, { replace: true });
      return;
    }
    navigate(-1);
  };

  if (!post) {
    return <h1>404 Post Not Found</h1>;
  }

  return (
    <div className="app-shell">
      <main className="main-content">
        <div className="feed">
          <button
            type="button"
            className="post-back-button"
            onClick={handleBackClick}
          >
            ← Back
          </button>

          <Post post={post} scene={fromScene} />
        </div>
      </main>
    </div>
  );
}