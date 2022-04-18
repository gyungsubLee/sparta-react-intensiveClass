import React from "react";
import { Button } from "../elements";
import { useSelector, useDispatch } from "react-redux";

import {actionCreators as imageActions} from "../redux/modules/image"

const Upload = (props) => { 
    const dispatch = useDispatch();
    const uploading = useSelector((state) => state.image.uploading);
    const fileInput = React.useRef();

    const selectFile = (e) => {
        console.log(e.target.files[0]); // -> FileList !== array 
        console.log(fileInput.current.files[0]);
        
        const reader = new FileReader();
        const file = e.target.files[0]

        //파일 내용 읽어옴.
        reader.readAsDataURL(file);

        reader.onloadend = () =>{
            //reader.result는 파일의 컨텐츠(내용물)입니다!
            console.log(reader.result);
            dispatch(imageActions.setPreview(reader.result));
        };
    };

    const uploadFB = () => {
        if (!fileInput.current || fileInput.current.files.length === 0){
            window.alert("파일을 선택해주세요!");
            return;
        }

        dispatch(imageActions.uploadImageFB(fileInput.current.files[0]));
    }

    return (
        <React.Fragment>
            <input 
                type="file" 
                ref={fileInput} 
                onChange={selectFile}
                disabled={uploading}
            />
            <Button _onClick={uploadFB}>업로드하기</Button>
        </React.Fragment>
    )
}

export default Upload;