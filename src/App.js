import styled from 'styled-components';
import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { storage } from './firebase/firebase';
import loadingGif from './preloader.gif';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';

/** https://dev.to/itnext/how-to-do-image-upload-with-firebase-in-react-cpj */

function App() {
  const allInputs = { imgUrl: '' };
  const [imgAsFile, setImageAsFile] = useState('');
  const [imgAsUrl, setImgAsUrl] = useState(allInputs);
  const [allImages, setAllImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleUpload = (e) => {
    const image = e.target.files[0];
    setImageAsFile((imageFile) => image);
  };

  const handleFireBaseUpload = (e) => {
    e.preventDefault();
    console.log('start of upload');
    // async magic goes here...
    if (imgAsFile === '') {
      console.error(`not an image, the image file is a ${typeof imgAsFile}`);
    }
    const uploadTask = storage.ref(`/images/${imgAsFile.name}`).put(imgAsFile);
    //initiates the firebase side uploading
    uploadTask.on(
      'state_changed',
      (snapShot) => {
        //takes a snap shot of the process as it is happening
        console.log(snapShot);
      },
      (err) => {
        //catches the errors
        console.log(err);
      },
      () => {
        console.log(imgAsFile)
        // gets the functions from storage refences the image storage in firebase by the children
        // gets the download url then sets the image from firebase as the value for the imgUrl key:
        storage
          .ref('images')
          .child(imgAsFile.name)
          .getDownloadURL()
          .then((fireBaseUrl) => {
            setImgAsUrl((prevObject) => ({
              ...prevObject,
              imgUrl: fireBaseUrl,
            }));
          });
      }
    );
  };

  const getImagesFromFirebase = async () => {
    const allImageUrls = [];
    try {
      const result = await storage.ref('images').listAll();
      Promise.all(
        result._delegate.items.map(async (item) => {
          const imgPath = item._location.path_.substr(
            6,
            item._location.path_.length
          );
          const imgUrl = await storage
            .ref('images')
            .child(`/${imgPath}`)
            .getDownloadURL();
          allImageUrls.push(imgUrl);
        })
      ).then(() => {
        setAllImages(allImageUrls);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getImagesFromFirebase();
  }, []);

  if (loading) {
    return <img src={loadingGif} alt='' />;
  } else {
    return (
      <Wrapper>
        <header>
          <h1>No Man's Sky Screens</h1>
          <p>
            A couple of buds document their journey through the cosmos in
            images.
          </p>
          <form class='form' onSubmit={handleFireBaseUpload}>
            <input
              class='file-upload'
              multiple
              type='file'
              onChange={handleUpload}
            />
            <Button
              type='submit'
              variant='contained'
              color='default'
              className={'button'}
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </form>
        </header>
        <div className='image-container'>
          {allImages.map((imageUrl, index) => {
            return <img class='image' key={index} src={imageUrl} alt='' />;
          })}
        </div>
      </Wrapper>
    );
  }
}

export default App;

const Wrapper = styled.section`
  header {
    display: flex;
    align-items: center;
    flex-direction: column;
    font-family: NMSFuturaProBook;
    h1 {
      font-size: 5rem;
    }
    p {
      font-size: 1.5rem;
    }
  }
  .form {
    display: flex;
    flex-direction: column;
    align-items: center;
    .file-upload {
      padding: 5px;
    }
  }
  .image {
    width: 100vw;
    margin: 10px 20px 0px 20px;
  }
`;
