import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';

import ImagePopup from './ImagePopup';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import api from '../utils/Api';
import ProtectedRouteElement from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import { PageNotFound } from './PageNotFound';
import InfoTooltip from './InfoTooltip';
import { PAGES } from '../utils/constants';
import { CurrentAuthUserContext } from '../contexts/CurrentAuthUserContext';

function App() {
  const [currentUser, setCurrentUser] = useState({});
  const [currentAuthUser, setCurrentAuthUser] = useState({});
  const [loggedIn, setLoggedIn] = useState((state) => !!localStorage.getItem('jwt'));
  const [isEditAvatarPopupOpen, setEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setAddPlacePopupOpen] = useState(false);
  const [isTooltipOpen, setTooltipOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipWithError, setTooltipError] = useState(false);
  const [cards, setCards] = useState([]);

  const handleEditAvatarClick = () => {
    setEditAvatarPopupOpen(true);
  };
  const handleEditProfileClick = () => {
    setEditProfilePopupOpen(true);
  };
  const handleUpdateUser = (userData) => {
    api
      .editProfileInfo(userData)
      .then(() => {
        setCurrentUser({ ...currentUser, ...userData });
        closeAllPopups();
      })
      .catch(console.error);
  };
  const handleUpdateAvatar = (avatar) => {
    api
      .editProfileAvatar(avatar)
      .then(() => {
        setCurrentUser({ ...currentUser, avatar });
        closeAllPopups();
      })
      .catch(console.error);
  };
  const handleAddPlaceClick = () => {
    setAddPlacePopupOpen(true);
  };
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };
  const handleCardLike = (card) => {
    const isLiked = card.likes.some((e) => e._id === currentUser._id);
    api
      .toggleLike(card._id, isLiked)
      .then((newCard) => {
        setCards(cards.map((e) => (e._id === newCard._id ? newCard : e)));
      })
      .catch(console.error);
  };
  const handleCardDelete = (card) => {
    api
      .removeCard(card._id)
      .then(() => {
        setCards(cards.filter((e) => e._id !== card._id));
      })
      .catch(console.error);
  };
  const handleAddPlaceSubmit = (card) => {
    console.log(card);
    api.addCard(card).then((card) => {
      console.log(card);
      setCards([card, ...cards]);
      closeAllPopups();
    });
  };

  const handleTooltipOpen = (title, withError) => {
    setTooltipText(title);
    setTooltipError(withError);
    setTooltipOpen(true);
  };

  const closeAllPopups = () => {
    setAddPlacePopupOpen(false);
    setEditProfilePopupOpen(false);
    setEditAvatarPopupOpen(false);
    setSelectedCard(false);
    setTooltipOpen(false);
  };
  useEffect(() => {
    Promise.all([api.getProfileData(), api.getCards()])
      .then(([user, cards]) => {
        setCards(cards);
        setCurrentUser(user);
      })
      .catch(console.error);
  }, []);
  // console.log('loggedIn:', loggedIn);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <CurrentAuthUserContext.Provider value={currentAuthUser}>
        <div className="page">
          <Header setAuthUser={setCurrentAuthUser} />
          <Routes>
            <Route
              path={PAGES.index}
              element={
                <ProtectedRouteElement
                  loggedIn={loggedIn}
                  element={Main}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                  cards={cards}
                />
              }
            />
            <Route
              path={PAGES.login}
              element={
                <Login
                  onError={handleTooltipOpen}
                  onSubmit={() => setLoggedIn(true)}
                  setCurrentAuthUser={setCurrentAuthUser}
                />
              }
            />
            <Route path={PAGES.register} element={<Register onSubmit={handleTooltipOpen} />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>

          <EditProfilePopup
            onClose={closeAllPopups}
            isOpen={isEditProfilePopupOpen}
            onSubmit={handleUpdateUser}
          />

          <EditAvatarPopup
            onClose={closeAllPopups}
            isOpen={isEditAvatarPopupOpen}
            onSubmit={handleUpdateAvatar}
          />

          <AddPlacePopup
            onClose={closeAllPopups}
            isOpen={isAddPlacePopupOpen}
            onSubmit={handleAddPlaceSubmit}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            onClose={closeAllPopups}
            title={tooltipText}
            isOpen={isTooltipOpen}
            withError={tooltipWithError}
          />
          <Footer />
        </div>
      </CurrentAuthUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
