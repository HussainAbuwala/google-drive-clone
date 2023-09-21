import { useReducer, useEffect } from "react";
import { database } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

const ACTIONS = {
   SELECT_FOLDER: "select-folder",
   UPDATE_FOLDER: "update-folder",
   SET_CHILD_FOLDERS: "set-child-folders",
   SET_CHILD_FILES: "set-child-files",
};

export const ROOT_FOLDER = { name: "Root", id: null, path: [] };

function reducer(state, { type, payload }) {
   switch (type) {
      case ACTIONS.SELECT_FOLDER:
         return {
            folderId: payload.folderId,
            folder: payload.folder,
            childFiles: [],
            childFolders: [],
         };
      case ACTIONS.UPDATE_FOLDER:
         return {
            ...state,
            folder: payload.folder,
         };
      case ACTIONS.SET_CHILD_FOLDERS:
         return {
            ...state,
            childFolders: payload.childFolders,
         };
      case ACTIONS.SET_CHILD_FILES:
         return {
            ...state,
            childFiles: payload.childFiles,
         };
      default:
         return state;
   }
}

export function useFolder(folderId = null, folder = null) {
   const [state, dispatch] = useReducer(reducer, {
      folderId,
      folder,
      childFolders: [],
      childFiles: [],
   });

   const { currentUser } = useAuth();

   useEffect(() => {
      dispatch({ type: ACTIONS.SELECT_FOLDER, payload: { folderId, folder } });
   }, [folderId, folder]);

   useEffect(() => {
      if (folderId == null) {
         return dispatch({
            type: ACTIONS.UPDATE_FOLDER,
            payload: { folder: ROOT_FOLDER },
         });
      }

      const docRef = database.doc(database.firestore, "folders", folderId);
      database
         .getDoc(docRef)
         .then((doc) => {
            dispatch({
               type: ACTIONS.UPDATE_FOLDER,
               payload: { folder: database.formatDoc(doc) },
            });
         })
         .catch((e) => {
            console.error(e);
            dispatch({
               type: ACTIONS.UPDATE_FOLDER,
               payload: { folder: ROOT_FOLDER },
            });
         });
   }, [folderId]);

   useEffect(() => {
      const q = database.query(
         database.folders,
         database.where("parentId", "==", folderId),
         database.where("userId", "==", currentUser.uid),
         database.orderBy("createdAt")
      );

      const unsubscribe = database.onSnapshot(q, (snapshot) => {
         dispatch({
            type: ACTIONS.SET_CHILD_FOLDERS,
            payload: { childFolders: snapshot.docs.map(database.formatDoc) },
         });
      });

      return unsubscribe;
   }, [folderId, currentUser]);

   useEffect(() => {
      const q = database.query(
         database.files,
         database.where("folderId", "==", folderId),
         database.where("userId", "==", currentUser.uid),
         database.orderBy("createdAt")
      );

      const unsubscribe = database.onSnapshot(q, (snapshot) => {
         dispatch({
            type: ACTIONS.SET_CHILD_FILES,
            payload: { childFiles: snapshot.docs.map(database.formatDoc) },
         });
      });

      return unsubscribe;
   }, [folderId, currentUser]);

   return state;
}
