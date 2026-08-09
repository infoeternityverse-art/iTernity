export const AUTH_SESSION_EXPIRED_EVENT = 'gpu-marketplace:auth-session-expired';

export const notifySessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};
