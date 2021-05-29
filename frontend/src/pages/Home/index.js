import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography } from '@material-ui/core';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home({ location }) {
  
    //-----------------------------------------

    const dispatch = useDispatch();

    const deleteError = () => dispatch({
        type: 'DELETE_ERROR'
    })

    const deleteSuccess = () => dispatch({
        type: 'DELETE_SUCCESS'
    })

    //-----------------------------------------

    const toastr = useSelector(state => state.toastr);

    //-----------------------------------------

    const notifyError = (m) => toast.error(m);
    const notifySuccess = (m) => toast.success(m);

    useEffect(()=>{
        if(toastr.error){
            notifyError(toastr.error);
            deleteError();
        }

        if(toastr.success){
            notifySuccess(toastr.success);
            deleteSuccess();
        }
    }, [])
  
    return (
        <Container>
            <Typography
                variant="h3"
                style={{
                    padding: '1.6em',
                    textAlign: 'center'
                }}
            >
                HOME
            </Typography>
            <ToastContainer />
        </Container>
    )
}

export default Home;