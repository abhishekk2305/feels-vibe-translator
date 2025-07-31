export default function FeedTest() {
  return (
    <div className="pb-20 px-4">
      <h1 style={{ color: '#8B5CF6', fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        TESTING FEED VISIBILITY
      </h1>
      
      <div style={{ 
        backgroundColor: '#FFFFFF',
        border: '3px solid #8B5CF6',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ 
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '20px' }}>S</span>
          </div>
          <div>
            <h4 style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>sarah_vibes</h4>
            <p style={{ color: '#A855F7', fontSize: '14px', margin: '4px 0 0 0' }}>2h ago • excited</p>
          </div>
        </div>
        
        <p style={{ color: '#6B21A8', fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>
          feeling absolutely amazing today! ✨
        </p>
        <p style={{ color: '#A855F7', fontSize: '16px', fontStyle: 'italic', marginBottom: '16px' }}>
          AI turned my happiness into this magical moment
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#EC4899' }}>
              <span style={{ fontSize: '20px' }}>❤️</span>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>42</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#A855F7' }}>
              <span style={{ fontSize: '20px' }}>💬</span>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>8</span>
            </button>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#A855F7' }}>
            <span style={{ fontSize: '20px' }}>📤</span>
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: '#FFFFFF',
        border: '3px solid #8B5CF6',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 8px 25px rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ 
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            backgroundColor: '#8B5CF6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '16px'
          }}>
            <span style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: '20px' }}>M</span>
          </div>
          <div>
            <h4 style={{ color: '#8B5CF6', fontWeight: 'bold', fontSize: '18px', margin: '0' }}>mike_creates</h4>
            <p style={{ color: '#A855F7', fontSize: '14px', margin: '4px 0 0 0' }}>1h ago • hyped</p>
          </div>
        </div>
        
        <p style={{ color: '#6B21A8', fontSize: '18px', fontWeight: '500', marginBottom: '16px' }}>
          when the weekend hits different 🚀
        </p>
        <p style={{ color: '#A855F7', fontSize: '16px', fontStyle: 'italic', marginBottom: '16px' }}>
          AI created the perfect weekend vibe
        </p>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#EC4899' }}>
              <span style={{ fontSize: '20px' }}>❤️</span>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>67</span>
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#A855F7' }}>
              <span style={{ fontSize: '20px' }}>💬</span>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>12</span>
            </button>
          </div>
          <button style={{ background: 'none', border: 'none', color: '#A855F7' }}>
            <span style={{ fontSize: '20px' }}>📤</span>
          </button>
        </div>
      </div>
    </div>
  );
}