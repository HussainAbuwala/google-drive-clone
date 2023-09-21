import React, { useState } from "react";
import ReactDOM from "react-dom";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ROOT_FOLDER } from "../../hooks/useFolder";
import { database } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { v4 as uuidV4 } from "uuid";
import { ProgressBar, Toast } from "react-bootstrap";

export default function AddFileButton({ currentFolder }) {
   const [uploadingFiles, setUploadingFiles] = useState([]);
   const { currentUser } = useAuth();
   //arrayOfObjects.map(obj => obj.name).join('/');
   function handleUpload(e) {
      const file = e.target.files[0];
      if (currentFolder == null || file == null) return;
      console.log(currentFolder.path);

      const id = uuidV4();

      setUploadingFiles((prevUploadingFiles) => [
         ...prevUploadingFiles,
         { id: id, name: file.name, progress: 0, error: false },
      ]);

      const filePath =
         currentFolder === ROOT_FOLDER
            ? `${currentFolder.path.map((obj) => obj.name).join("/")}/${
                 file.name
              }`
            : `${currentFolder.path.map((obj) => obj.name).join("/")}/${
                 currentFolder.name
              }/${file.name}`;

      const storageRef = database.ref(
         database.storage,
         `/files/${currentUser.uid}/${filePath}`
      );

      console.log(filePath);

      const uploadTask = database.uploadBytesResumable(storageRef, file);

      uploadTask.on(
         "state_changed",
         (snapshot) => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            setUploadingFiles((prevUploadingFiles) => {
               return prevUploadingFiles.map((uploadFile) => {
                  if (uploadFile.id === id) {
                     return { ...uploadFile, progress: progress };
                  }

                  return uploadFile;
               });
            });
         },
         (error) => {
            // Handle unsuccessful uploads
            setUploadingFiles((prevUploadingFiles) => {
               return prevUploadingFiles.map((uploadFile) => {
                  if (uploadFile.id === id) {
                     return { ...uploadFile, error: true };
                  }
                  return uploadFile;
               });
            });
         },
         () => {
            setUploadingFiles((prevUploadingFiles) => {
               return prevUploadingFiles.filter((uploadFile) => {
                  return uploadFile.id !== id;
               });
            });
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            database
               .getDownloadURL(uploadTask.snapshot.ref)
               .then(async (downloadURL) => {
                  console.log("File available at", downloadURL);
                  const document = {
                     url: downloadURL,
                     name: file.name,
                     createdAt: database.getCurrentTimestamp(),
                     folderId: currentFolder.id,
                     userId: currentUser.uid,
                  };
                  try {
                     const docRef = await database.addDoc(
                        database.files,
                        document
                     );
                     console.log("File written with ID: ", docRef.id);
                  } catch (e) {
                     console.error("Error adding file: ", e);
                  }
               });
         }
      );
   }
   return (
      <>
         <label className="btn btn-outline-success btn-sm m-0 mr-2 mt-1">
            <FontAwesomeIcon icon={faFileUpload} />
            <input
               type="file"
               onChange={handleUpload}
               style={{ opacity: 0, position: "absolute", left: "-9999px" }}
            />
         </label>
         {uploadingFiles.length > 0 &&
            ReactDOM.createPortal(
               <div
                  style={{
                     position: "absolute",
                     bottom: "1rem",
                     right: "1rem",
                     maxWidth: "250px",
                  }}
               >
                  {uploadingFiles.map((file) => (
                     <Toast
                        key={file.id}
                        onClose={() => {
                           setUploadingFiles((prevUploadingFiles) => {
                              return prevUploadingFiles.filter((uploadFile) => {
                                 return uploadFile.id !== file.id;
                              });
                           });
                        }}
                     >
                        <Toast.Header
                           closeButton={file.error}
                           className="text-truncate w-100 d-block"
                        >
                           {file.name}
                        </Toast.Header>
                        <Toast.Body>
                           <ProgressBar
                              animated={!file.error}
                              variant={file.error ? "danger" : "primary"}
                              now={file.error ? 100 : file.progress * 100}
                              label={
                                 file.error
                                    ? "Error"
                                    : `${Math.round(file.progress * 100)}%`
                              }
                           />
                        </Toast.Body>
                     </Toast>
                  ))}
               </div>,
               document.body
            )}
      </>
   );
}
