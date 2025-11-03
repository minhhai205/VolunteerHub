// /lib/unauthorizedDialog.ts

export function showUnauthorizedDialog(redirectUrl: string) {
  // Kiểm tra xem đã có dialog chưa để tránh duplicate
  if (document.getElementById('unauthorized-overlay')) {
    return;
  }

  // Tạo overlay với animation
  const overlay = document.createElement('div');
  overlay.id = 'unauthorized-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(0px);
    transition: all 0.3s ease;
  `;

  // Tạo hộp thoại
  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
    border-radius: 20px;
    padding: 2px;
    max-width: 440px;
    width: 90%;
    transform: scale(0.9);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  `;

  const dialogInner = document.createElement('div');
  dialogInner.style.cssText = `
    background: white;
    border-radius: 18px;
    padding: 40px 32px;
    position: relative;
    overflow: hidden;
  `;

  // Thêm decoration background
  const decoration = document.createElement('div');
  decoration.style.cssText = `
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(134, 239, 172, 0.15) 0%, transparent 70%);
    pointer-events: none;
  `;
  dialogInner.appendChild(decoration);

  dialogInner.innerHTML += `
    <div style="text-align: center; position: relative; z-index: 1;">
      <!-- Icon với animation -->
      <div style="
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 24px rgba(74, 222, 128, 0.3);
        animation: pulse 2s ease-in-out infinite;
      ">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>
      
      <!-- Title -->
      <h2 style="
        margin: 0 0 12px 0;
        background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.5px;
      ">
        Bạn không có quyền truy cập
      </h2>
      
      <!-- Description -->
      <p style="
        margin: 0 0 32px 0;
        color: #64748b;
        font-size: 15px;
        line-height: 1.6;
        font-weight: 400;
      ">
        Phiên đăng nhập của bạn đã hết hạn hoặc bạn chưa đăng nhập.<br>
        Vui lòng đăng nhập để tiếp tục.
      </p>
      
      <!-- Button -->
      <button id="loginButton" style="
        width: 100%;
        background: linear-gradient(135deg, #86efac 0%, #4ade80 100%);
        color: #065f46;
        border: none;
        border-radius: 12px;
        padding: 16px 24px;
        font-size: 15px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 16px rgba(74, 222, 128, 0.35);
        position: relative;
        overflow: hidden;
      ">
        <span style="position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
            <polyline points="10 17 15 12 10 7"></polyline>
            <line x1="15" y1="12" x2="3" y2="12"></line>
          </svg>
          Đăng nhập để tiếp tục
        </span>
      </button>
      
      <!-- Footer text -->
      <p style="
        margin: 20px 0 0 0;
        color: #94a3b8;
        font-size: 13px;
      ">
        Bạn sẽ quay lại trang này sau khi đăng nhập
      </p>
    </div>
  `;

  // Thêm keyframe animation
  const style = document.createElement('style');
  style.id = 'unauthorized-dialog-styles';
  style.textContent = `
    @keyframes pulse {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 8px 24px rgba(74, 222, 128, 0.3);
      }
      50% {
        transform: scale(1.05);
        box-shadow: 0 12px 32px rgba(74, 222, 128, 0.4);
      }
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;
  
  // Chỉ thêm style nếu chưa có
  if (!document.getElementById('unauthorized-dialog-styles')) {
    document.head.appendChild(style);
  }

  dialog.appendChild(dialogInner);
  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => {
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    overlay.style.backdropFilter = 'blur(8px)';
    dialog.style.transform = 'scale(1)';
    dialog.style.opacity = '1';
  });

  // Xử lý sự kiện nút
  const loginButton = document.getElementById('loginButton');
  if (loginButton) {
    // Hover effect
    loginButton.addEventListener('mouseenter', () => {
      loginButton.style.transform = 'translateY(-2px)';
      loginButton.style.boxShadow = '0 8px 24px rgba(74, 222, 128, 0.5)';
      loginButton.style.background = 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)';
    });
    
    loginButton.addEventListener('mouseleave', () => {
      loginButton.style.transform = 'translateY(0)';
      loginButton.style.boxShadow = '0 4px 16px rgba(74, 222, 128, 0.35)';
      loginButton.style.background = 'linear-gradient(135deg, #86efac 0%, #4ade80 100%)';
    });
    
    // Click effect
    loginButton.addEventListener('mousedown', () => {
      loginButton.style.transform = 'translateY(0) scale(0.98)';
    });
    
    loginButton.addEventListener('mouseup', () => {
      loginButton.style.transform = 'translateY(-2px) scale(1)';
    });
    
    // Redirect
    loginButton.addEventListener('click', () => {
      loginButton.innerHTML = `
        <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          Đang chuyển hướng...
        </span>
      `;
      loginButton.style.pointerEvents = 'none';
      
      setTimeout(() => {
        window.location.replace(redirectUrl);
      }, 200);
    });
  }

  // Ngăn ESC key
  const escapeHandler = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
    }
  };
  document.addEventListener('keydown', escapeHandler);
  
  // Cleanup khi overlay bị remove
  overlay.addEventListener('DOMNodeRemoved', () => {
    document.removeEventListener('keydown', escapeHandler);
  });
}