import { updateLocale } from "moment";
import React from "react";

import { Button } from "../elements";
import {storage} from "./firebase";

const Upload = (props) => { 
    const fileInput = React.useRef();
    const selectFile = (e) => {
        console.log(e.target.files); // -> FileList !== array 
        console.log(fileInput.current.files[0]);
    }
    const uploadFB = () => {
        let image = fileInput.current.files[0];
        const _upload = storage.ref(`images/${image.name}`).put(image);

        _upload.then((snapshot) => {
            console.log(snapshot);
            
            snapshot.ref.getDownloadURL().then((url) => {
                console.log(url)
            });
        });
    }

    return (
        <React.Fragment>
            <input type="file" ref={fileInput} onChange={selectFile}/>
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}

export default Upload;