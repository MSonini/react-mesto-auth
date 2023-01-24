import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CurrentAuthUserContext } from '../contexts/CurrentAuthUserContext';
import { PAGES } from '../utils/constants';

export default function Header() {
  const currentAuthUser = useContext(CurrentAuthUserContext);
  const location = useLocation();
  const navigate = useNavigate();
  let action = null;
  let actionName = 'Выйти';

  const handleLoginClick = () => {
    navigate(PAGES.login);
  };
  const handleLogoutClick = () => {
    localStorage.removeItem('jwt');
    navigate(PAGES.login);
  };
  const handleRegisterClick = () => {
    navigate(PAGES.register);
  };

  switch (location.pathname) {
    case PAGES.login:
      action = handleRegisterClick;
      actionName = 'Регистрация';
      break;
    case PAGES.register:
      action = handleLoginClick;
      actionName = 'Войти';
      break;

    case PAGES.index:
      action = handleLogoutClick;
      actionName = 'Выйти';
      break;

    default:
      action = handleLoginClick;
      actionName = 'Войти';
  }
  console.log('currentAuthUser:', currentAuthUser);
  return (
    <header className="header">
      <div className="header__logo"></div>
      <div className="header__actions">
        {location.pathname === '/' && Object.values(currentAuthUser).length > 0 && (
          <div className="header__email">{currentAuthUser.email}</div>
          // <span className="header__email">{'test@test.ru'}</span>
        )}
        <button className="button header__action-btn" onClick={action}>
          {actionName}
        </button>
      </div>
    </header>
  );
}
