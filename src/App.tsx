import { useState } from 'react';
import Editor from './Editor';

interface Post {
  id: number;
  title: string;
  content: string; // JSON string from Lexical
}

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');

  const handleSave = () => {
    if (!currentTitle) {
      alert('제목을 입력하세요.');
      return;
    }
    const newPost: Post = {
      id: Date.now(),
      title: currentTitle,
      content: currentContent,
    };
    setPosts([newPost, ...posts]);
    setIsEditing(false);
    setCurrentTitle('');
    setCurrentContent('');
  };

  return (
    <div className="App">
      <h1>Lexical React 게시판</h1>

      {!isEditing ? (
        <div>
          <button 
            onClick={() => setIsEditing(true)}
            style={{ padding: '10px 20px', marginBottom: '20px', cursor: 'pointer' }}
          >
            새 글 작성
          </button>
          <div className="post-list">
            {posts.length === 0 && <p>게시글이 없습니다.</p>}
            {posts.map((post) => (
              <div key={post.id} className="board-post">
                <h3>{post.title}</h3>
                <div style={{ fontSize: '0.9em', color: '#666' }}>
                  ID: {post.id} (콘텐츠 데이터 포함됨)
                </div>
                {/* 
                  실제 서비스에서는 리딩 전용 Editor를 사용해 content를 렌더링해야 하지만,
                  여기서는 데모를 위해 JSON이 저장됨을 표시합니다.
                */}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="editor-view">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={currentTitle}
            onChange={(e) => setCurrentTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              fontSize: '1.2em',
              boxSizing: 'border-box'
            }}
          />
          <Editor onChange={(state) => setCurrentContent(state)} />
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={handleSave}
              style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}
            >
              저장
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              style={{ padding: '10px 20px', cursor: 'pointer' }}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
