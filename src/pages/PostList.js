// PostList.js
import React from "react";
import {useDispatch, useSelector} from "react-redux";

import Post from "../components/Post";
import { actionCreators as postActions } from "../redux/modules/post";

const PostList = (props) => {
    const dispatch = useDispatch();
    const post_list = useSelector((state) => state.post.list);
    console.log(post_list.length);
    React.useEffect(()=>{
        //새로고침 -> redux날아감 -> FB에서 가져온다.
        if(post_list.length === 0){
            dispatch(postActions.getPostFB());
        }
    }, []);

    return (
        <React.Fragment>
            {post_list.map((p, idx) => {
                return <Post key={idx} {...p}/>
            })}
        </React.Fragment>
    )
}

export default PostList;

