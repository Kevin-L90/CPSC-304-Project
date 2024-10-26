import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from '.';

import HomePage from './Pages/Home'
import CardsPage from './Pages/Cards'
import DecksPage from './Pages/Decks'

import './index.css'
import Middrop from './Components/Middrop';
import CardPage from './Pages/Card';
import CreateDeckPage from './Pages/UploadDeck';
import DeckPage from './Pages/Deck';
import UserPage from './Pages/User';
import EditDeckPage from './Pages/EditDeck';
import UserSettingsPage from './Pages/UserSettings';

const router = createBrowserRouter([
  {
    element: <Layout />,
    path: "/",
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "card/:artid/:setname/:cardname",
        element: <CardPage />,
      },
      {
        path: "decks/create",
        element: <CreateDeckPage />
      },
      {
        path: "decks/edit/:deckid",
        element: <EditDeckPage />
      },
      {
        path: "user/settings",
        element: <UserSettingsPage />
      },
      {
        element: <Middrop />,
        children: [
          {
            path: "cards",
            element: <CardsPage />
          },
          {
            path: "decks",
            element: <DecksPage />
          },
          {
            path: "deck/:deckid",
            element: <DeckPage />
          },
          {
            path: "user/:userid",
            element: <UserPage />
          }]
      }]}]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

