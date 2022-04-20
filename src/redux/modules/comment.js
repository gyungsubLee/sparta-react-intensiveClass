import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore } from "../../shared/firebase";
import "moment";
import moment from "moment";


import { actionCreators as postActions } from "./post";


const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";

const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({post_id, comment_list}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({post_id, comment}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
    list: [],
    is_loading: false,
};

const addCommentFB = (post_id, contents) => {
    return function(dispatch, getState, {history}){
        const commentDB = firestore.collection("comment");
        const user_info = getState().user.user;

        let comment = {
            post_id: post_id,
            user_id: user_info.uid,
            user_name: user_info.user_name,
            user_profile: user_info.user_profile,
            contents: contents,
            insert_dt: moment().format("YYYY-MM-DD hh:mm:ss")
        }

        commentDB.add(comment).then((doc)=>{
            const postDB = firestore.collection("post");
            comment = {...comment, id: doc.id};

            const post = getState().post.list.find(l => l.id === post_id); 

            //firebase 내장 라이브러리? 
            // 현재 데이터에서 준 인자만큼 더해준다.
            const Increment = firestore.FieldPath.increment(1);
            // let a = 5; a = a+1

            postDB
                .doc(post_id)
                .update({comment_cnt: Increment})
                .then((_post)=>{
                    dispatch(addComment(post_id, comment));
                
                //post 없을 시 예외처리
                if(post){
                    //js의 묵시적 형변환: str + int = str
                    dispatch(
                        postActions.editPost(post_id, {
                            comment_cnt: parseInt(post.comment_cnt) + 1
                        }))
                    ;
                }
            })
        })
    }
}

const getCommentFB = (post_id = null) => {
    return function(dispatch, getState, {history}){
        if(!post_id){
            return;
        }

        const commentDB = firestore.collection("comment");

        commentDB
            .where("post_id", "==", post_id)
            .orderBy("insert_dt", "desc")
            .get()
            .then((docs) =>{
                let list = [];
                docs.forEach((doc) => {
                    list.push({...doc.data(), id: doc.id});
                })
                dispatch(setComment(post_id, list));
            }).catch(err =>{
                console.log("댓글 가져오기 실패!", post_id, err);
            });
    }
}


export default handleActions(
    {
        [SET_COMMENT]: (state, action) => produce(state, (draft) => {
            // comment:딕셔너리
            // post_id로 나눠 보관 (각각 게시글 방을 만들어준다고 생각하면 구조 이해가 쉽다? 뭐가..._
            draft.list[action.payload.post_id] = action.payload.comment_list;
        }),
        [ADD_COMMENT]: (state, action) => produce(state, (draft)=> {
            draft.list[action.payload.post_id].push(action.payload.comment);
        }),
        [LOADING]: (state, action) => 
        produce(state, (draft) => {
            draft.is_loading = action.payload.is_loading;
        })
    },
    initialState
);

const actionCreators = {
    getCommentFB,
    addCommentFB,
    setComment,
    addComment,
};

export { actionCreators };