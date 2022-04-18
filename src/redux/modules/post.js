import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";

import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";

const setPost = createAction(SET_POST, (post_list) => ({post_list}));
const addPost = createAction(ADD_POST, (post) => ({post}));

const initialState = {
    list: [],
}

// 게시글 하나에는 어떤 정보가 있어야 하는 지 하나 만들어둡시다! :)
const initialPost = {
    // id:0,(firebase-데이터 id)
    // user_info: {
    //     user_id: 0,
    //     user_name: "mean0",
    //     user_profile: "https://cdn.pixabay.com/photo/2022/02/12/19/58/cat-7009836_960_720.jpg",
    // },
    image_url: "",
    contents: "",
    comment_cnt: 0,
    // insert_dt: "2021-02-27 10:00:00",
    insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
};


//middleware
const addPostFB = (contents="") =>{
    return function (dispatch, getState, {history}){
        const postDB = firestore.collection("post");
        //getState: redux-store의 state에 접근 가능하게 해준다.
        const _user = getState().user.user;
        const _image = getState().image.preview;

        const user_info = {
            user_name: _user.user_name,
            user_id: _user.uid,
            user_profile: _user.user_profile,
        };

        const _post = {
            ...initialPost,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
        };
        // console.log(_image);
        // console.log(typeof(_image);
        const _upload = storage.ref(`images/${user_info.user_id}_${new Date().getTime()}`)
        _upload.putString(_image, 'data_url')
        .then((snapshot) => {
            snapshot.ref.getDownloadURL().then(url => {
                console.log(url);
                //promise 안의 값 return으로 내보내줘야 쓰기 가능
                return url;
            }).then(url => {
                //firebase에 추가: ~~.add({ddaefeafea})
                postDB
                .add({...user_info, ..._post, image_url: url})
                .then((doc) => {
                    let post = {user_info, ..._post, id:doc.id, image_url: url};
                    dispatch(addPost(post));
                    history.replace("/");

                    dispatch(imageActions.setPreview(null));
                })
                .catch((err) =>{
                    window.alert("앗! 포스트 작성에 문제가 있어요!");
                    console.log("post 작성에 실패 했어요!", err);
                })
            }).catch((err) => {
                window.alert("앗! 이미지 업로드에 문제가 있어요!");
                console.log("이미지 업로드에 실패 했습니다.", err);
            })
        });
    }
}

const getPostFB = () =>{
    return function (dispatch, getState, {history}){
        const postDB = firestore.collection("post");

        postDB.get().then((doc)=>{
            let post_list = [];
            doc.forEach((doc) =>{
                
                // 1)
                // let _post = {
                //     id: doc.id,
                //     ...doc.data()
                // };
                // let post = {
                //     id: doc.id,
                //     user_info: {
                //         user_name: _post.user_name,
                //         user_profile: _post.user_profile,
                //         user_id: _post.user_id,
                //     },
                //     image_url: _post.image_url,
                //     contents: _post.contents,
                //     comment_cnt: _post.comment_cnt,
                //     insert_dt: _post.insert_dt,
                // };
                // post_list.push(post);

                //2) 더 나은 방법
                let _post = doc.data();
                
                //object의 keys로 배열을 만든다. -> 배열의 내장함수 사용 가능
                //['comment_cnt', 'cotents', ...]
                //reducer(배열의 내장함수):  
                let post = Object.keys(_post).reduce((acc, cur)=>{
                    if(cur.indexOf("user_") !== -1){
                        return {
                            ...acc,
                            user_info: {...acc.user_info, [cur]: _post[cur]},
                        }
                    }
                    return {...acc, [cur]: _post[cur]};
                 }, 
                 {id: doc.id, user_info: {}},
                );
                post_list.push(post);
            })
            console.log(post_list);
            dispatch(setPost(post_list));
        });
    }
}





// reducer
export default handleActions(
    {
        [SET_POST]: (state, action) => produce(state, (draft) => {
            draft.list = action.payload.post_list;
        }),

        [ADD_POST]: (state, action) => produce(state, (draft) => {
            draft.list.unshift(action.payload.post);
        })
    },
    initialState
);



// action creator export
const actionCreators = {
    setPost,
    addPost,
    getPostFB,
    addPostFB,
};
export { actionCreators };