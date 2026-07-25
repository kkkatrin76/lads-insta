// import { useEffect, useRef, useState } from 'react';
// import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
// import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

// // const stories = [
// //   { id: 1, name: 'You', image: '🧑‍💻' },
// // ];

// // TODO: let ppl change these
// let usrids = {
//   me: "You",
//   xavier: "Xavier",
//   zayne: "Zayne",
//   rafayel: "Rafayel",
//   sylus: "Sylus",
//   caleb: "Caleb",
//   valko: "Valko",
// }

// const initialPosts = [
//   {
//     user: 'valko',
//     image: 'v01.jpeg',
//     caption: 'New record today! >:3',
//     comments: [
//       { user: 'me', text: 'bench me next' },
//       { user: 'valko', replyTo: 'me', text: 'Come to the gym then pup' },
//     ],
//     commentOptions: [
//       [{ user: "me", text: "bench me next" }, { user: "valko", text: "Come to the gym then pup" }],
//       [{ user: "me", text: "holy shit" }, { user: "valko", text: "Try not to drool baby" }],
//       [{ user: "me", text: "can i lick it" }, { user: "valko", text: "You sure? Remember that once you lick, it becomes yours" }]
//     ]
//   },
//   {
//     user: 'me',
//     caption: "where do i find LADS assets bro i can't find them anywhere. where r the miners at",
//   },
//   {
//     user: 'sylus',
//     caption: 'Pet your cat today.',
//     image: 's01.jpeg',
//   },
//   {
//     user: 'valko',
//     caption: 'Late-night walk with a fresh idea.',
//   },
//   {
//     user: 'xavier',
//     caption: 'Late-night walk with a fresh idea.',
//   },
//   {
//     user: 'zayne',
//     caption: 'Late-night walk with a fresh idea.',
//   },
// ];

// function App() {
//   const fileInputRef = useRef(null);
//   const [posts, setPosts] = useState(initialPosts);
//   const [showFooterPanel, setShowFooterPanel] = useState(false);
//   const [activePostIndex, setActivePostIndex] = useState(null);
//   const [activeReplyOptionIndex, setActiveReplyOptionIndex] = useState(null);
//   const [replyText, setReplyText] = useState('');
//   const [name, setName] = useState(() => {
//     if (typeof window === 'undefined') {
//       return '[name]';
//     }

//     return window.localStorage.getItem('dashboard-name') || '[name]';
//   });
//   const [profileImage, setProfileImage] = useState(() => {
//     if (typeof window === 'undefined') {
//       return '/icons/you.png';
//     }

//     return window.localStorage.getItem('user-pfp') || '/icons/you.png';
//   });

//   useEffect(() => {
//     window.localStorage.setItem('dashboard-name', name);
//   }, [name]);

//   useEffect(() => {
//     window.localStorage.setItem('user-pfp', profileImage);
//   }, [profileImage]);

//   const handleNameClick = () => {
//     const nextName = window.prompt('Enter your name', name);

//     if (nextName !== null) {
//       setName(nextName.trim() || '[name]');
//     }
//   };

//   const handleProfileImageClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleProfileImageChange = (event) => {
//     const file = event.target.files?.[0];

//     if (!file) {
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       window.alert('Please choose an image smaller than 2MB.');
//       event.target.value = '';
//       return;
//     }

//     const reader = new FileReader();

//     reader.onloadend = () => {
//       setProfileImage(String(reader.result));
//       event.target.value = '';
//     };

//     reader.readAsDataURL(file);
//   };

//   const handleCommentClick = (postIdx) => {
//     setActivePostIndex(postIdx);
//     setActiveReplyOptionIndex(null);
//     setReplyText('');
//     setShowFooterPanel((current) => !current);
//   };
//   const handleLikeClick = (postIdx) => {
//     setPosts((currentPosts) =>
//       currentPosts.map((post, index) =>
//         index === postIdx ? { ...post, liked: !post.liked } : post
//       )
//     );
//   };

//   const handleSendClick = () => {
//     const nextReply = replyText.trim();
//     const activePost = posts[activePostIndex];

//     if (activePostIndex === null || !activePost) {
//       return;
//     }

//     const selectedOptionGroup =
//       activeReplyOptionIndex !== null
//         ? activePost.commentOptions?.[activeReplyOptionIndex]
//         : null;

//     const commentsToAppend = selectedOptionGroup?.length
//       ? selectedOptionGroup
//       : nextReply
//         ? [{ user: 'me', text: nextReply }]
//         : null;

//     if (!commentsToAppend) {
//       return;
//     }

//     setPosts((currentPosts) =>
//       currentPosts.map((post, index) =>
//         index === activePostIndex
//           ? {
//               ...post,
//               comments: [...(post.comments || []), ...commentsToAppend],
//             }
//           : post
//       )
//     );

//     setReplyText('');
//     setActiveReplyOptionIndex(null);
//     setShowFooterPanel(false);
//   };

//   return (
//     <div className="app-shell">
//       <main className="main-content">
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           hidden
//           onChange={handleProfileImageChange}
//         />
//         <header className="topbar">
//           {/* <div className="welcome-row">
//             <h1>Welcome back, <span className="name-button" onClick={handleNameClick}>{name}</span>!</h1>
//           </div> */}
//           <span className="name-button" onClick={handleNameClick}>{name}</span>
//           <img
//             src={profileImage}
//             alt="your-pfp"
//             className="user-pfp"
//             id="user-pfp"
//             onClick={handleProfileImageClick}
//           />
//         </header>

//         {/* <section className="stories">
//           {stories.map((story) => (
//             <div key={story.id} className="story-card">
//               <div className="story-avatar">{story.image}</div>
//               <span>{story.name}</span>
//             </div>
//           ))}
//         </section> */}

//         <section className="feed">
//           {posts.map((post, index) => (
//             <article key={`post-${index}`} className="post-card">
//               <div className="post-left">
//                 <img className="post-pfp" src={post.user === 'me' ? profileImage : `/icons/${post.user}.png`} alt={post.user} />
//               </div>

//               <div className="post-right">
//                 <div className="post-header">{post.user === 'me' ? name : usrids[post.user]}</div>
                
//                 <p className="post-caption">{post.caption}</p>
//                 {post.image && <img className="post-image" src={`/posts/${post.image}`} alt="Post" />}
//                 <div className="post-footer">
//                   <ChatBubbleOutlineOutlinedIcon className="icon comment" onClick={() => handleCommentClick(index)} />
//                   {post.liked ? (
//                     <FavoriteIcon className="icon heart hearted" onClick={() => handleLikeClick(index)} />
//                   ) : (
//                     <FavoriteBorderOutlinedIcon className="icon heart" onClick={() => handleLikeClick(index)} />
//                   )}
//                 </div>
                
//                 {post.comments && (<div className="post-comments"> 
//                   {post.comments.map((comment, index) => (
//                     <span>
//                     {comment.replyTo ?
//                       (<div key={`post-${index}-comment-${index}`}><span className="username">{comment.user === 'me' ? name : usrids[comment.user]}</span> replied to <span className="username">{comment.replyTo === 'me' ? name : usrids[comment.replyTo]}</span>: {comment.text}</div>) :
//                       (<div key={`post-${index}-comment-${index}`}><span className="username">{comment.user === 'me' ? name : usrids[comment.user]}</span>: {comment.text}</div>)
//                     }
//                     </span>
//                   ))}</div>)}
                
//               </div>
//             </article>
//           ))}
//         </section>

//         <section className="replies-panel">
//           {showFooterPanel && (
//             <div className="toggle-panel-content">
//               <div className="reply-input-row">
//                 <input
//                   type="text"
//                   className="reply-input"
//                   placeholder="Write a reply"
//                   value={replyText}
//                   onChange={(event) => setReplyText(event.target.value)}
//                   onKeyDown={(event) => {
//                     if (event.key === 'Enter') {
//                       event.preventDefault();
//                       handleSendClick();
//                     }
//                   }}
//                 />

//                 <button
//                   type="button"
//                   className="reply-submit-button"
//                   aria-label="Send reply"
//                   onClick={handleSendClick}
//                 >
//                   <SendOutlinedIcon />
//                 </button>
//               </div>

//               {posts[activePostIndex]?.commentOptions?.length > 0 && (
//                 <div className="reply-options">
//                   {posts[activePostIndex].commentOptions.map((optionGroup, optionIndex) => (
//                     <button
//                       key={`reply-option-${optionIndex}`}
//                       type="button"
//                       className={`reply-option-button${activeReplyOptionIndex === optionIndex ? ' selected' : ''}`}
//                       onClick={() => {
//                         setReplyText(optionGroup[0]?.text || '');
//                         setActiveReplyOptionIndex(optionIndex);
//                       }}
//                     >
//                       {optionGroup[0]?.text}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// }

// export default App;


import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import FeedPage from "./pages/FeedPage";
import ScenePage from "./pages/ScenePage";
import PostPage from "./pages/PostPage";
import SettingPage from "./pages/SettingPage";

function NotificationHost() {
  const [notifications, setNotifications] = useState([]);

  const playToastSound = () => {
    if (typeof window === "undefined") {
      return;
    }

    const audio = new Audio("/sfx/lad_message_tone.mp3");
    audio.volume = 0.7;
    audio.play().catch(() => {});
  };

  useEffect(() => {
    const handleNotify = (event) => {
      const notification = event.detail;

      if (!notification?.text) {
        return;
      }

      setNotifications((current) => {
        if (current.some((item) => item.id === notification.id)) {
          return current;
        }

        playToastSound();
        return [...current, notification];
      });

      window.setTimeout(() => {
        setNotifications((current) => current.filter((item) => item.id !== notification.id));
      }, 5000);
    };

    window.addEventListener("app:notify", handleNotify);

    return () => {
      window.removeEventListener("app:notify", handleNotify);
    };
  }, []);

  const dismissNotification = (notificationId) => {
    setNotifications((current) => current.filter((item) => item.id !== notificationId));
  };

  return (
    <>
      <div className="notification-stack">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-toast">
            <span>{notification.text}</span>
            <button type="button" className="notification-close" onClick={() => dismissNotification(notification.id)} aria-label="Close notification">
              ×
            </button>
          </div>
        ))}
      </div>

      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<FeedPage />} /> */}
          <Route path="/r/:scene" element={<ScenePage />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/settings" element={<SettingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default function App() {
  return <NotificationHost />;
}