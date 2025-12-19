import { useDispatch, useSelector } from 'react-redux'
import { addimg, addTodo, api, checkTodo, delimg, delTodo, editTodo, getTodo, infoTodo } from './reduce/api'
import "./App.css"
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";




const App = () => {

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm()
  };


  const [open2, setOpen2] = useState(false);

  const handleClickOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };


  const [open1, setOpen1] = useState(false);

  const handleClickOpen1 = () => {
    setOpen1(true);
  };

  const handleClose1 = () => {
    setOpen1(false);
  };



  const { data, info, loading } = useSelector((state) => state.todo)

  const dipathc = useDispatch()

  useEffect(() => {
    dipathc(getTodo())
  }, [])


  const { handleChange, handleSubmit, resetForm, values, setFieldValue } = useFormik({
    initialValues: {
      name: "",
      description: "",
      isCompleated: false
    },
    onSubmit: (values) => {
      let formdata = new FormData();

      if (values.id) {
        dipathc(editTodo(values));
      } else if (idx) {
        let imgadd = values.images;
        for (let i = 0; i < imgadd.length; i++) {
          formdata.append("images", imgadd[i]);
        }
        dipathc(addimg({ ...values, id: idx }));
      } else {
        formdata.append("name", values.name);
        formdata.append("description", values.description);
        for (let i = 0; i < values.images.length; i++) {
          formdata.append("images", values.images[i]);
        }
        dipathc(addTodo(formdata));
      }

      handleClose();
      resetForm()
    }
  })


  const [idx, setidz] = useState(null)


  const handlefield = (e) => {
    handleClickOpen()
    setFieldValue("name", e.name)
    setFieldValue("description", e.description)
    setFieldValue("id", e.id)
  }

  const [search, setSearch] = useState("");
  const [filterstatus, setFilterstatus] = useState("0");
  const filteruser = data.filter((todo: any) =>
    todo?.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <CircularProgress disableShrink />;
  }



  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button>
      <select
        value={filterstatus}
        onChange={(e) => setFilterstatus(e.target.value)}
      >
        <option value="0">All</option>
        <option value="1">Active</option>
        <option value="2">Inactive</option>
      </select>
      <input
        className="border p-2 mr-2"
        type="search"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {values.id ? "edit user" : "add user "}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" }}>
            <input type="text" name="name" value={values.name} onChange={handleChange} />
            <input type="text" name="description" value={values.description} onChange={handleChange} />
            <input type="file" name="images" onChange={(e) => setFieldValue("images", e.target.files[0])} />
            <button type="submit">save</button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button onClick={handleClose} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id (100g serving)</TableCell>
              <TableCell align="right">name&nbsp;(g)</TableCell>
              <TableCell align="right">description&nbsp;(g)</TableCell>
              <TableCell align="right">isCompleated&nbsp;(g)</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteruser?.filter((e: any) =>
              filterstatus === "0"
                ? true
                : filterstatus === "1"
                  ? e.isCompleted
                  : !e.isCompleted
            ).map((e) => {
              return <TableRow key={e.id}>
                <TableCell>{e.id}</TableCell>
                <TableCell>{e.name}</TableCell>
                <TableCell>{e.description}</TableCell>
                <TableCell className={e.isCompleted ? "active" : "inactive"}>{e.isCompleted ? "active" : "inactive"}</TableCell>
                <TableCell>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <button onClick={() => handlefield(e)}>edit</button>
                    <button onClick={() => dipathc(delTodo(e.id))}>del</button>
                    <button onClick={() => {
                      dipathc(infoTodo(e.id)),
                        handleClickOpen1()
                    }}>info</button>
                    <input type="checkbox" checked={e.isCompleted} onClick={() => dipathc(checkTodo(e))} />
                  </div>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"INFO DIALOG"}
        </DialogTitle>
        <DialogContent>
          <h1>{info.name}</h1>
          <h1>{info.description}</h1>
          <button onClick={() => {
            setidz(info.id)
            handleClickOpen2()
          }
          }
          >add Image</button>
          <h1>{info.isCompleted ? "active" : "inactive"}</h1>
          <div style={{ display: 'flex', gap: "10px", overflow: "auto" }}>
            {info?.images?.map((e) => {
              return <div style={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "10px" }}>
                <img style={{ width: "200px", height: "200px" }} src={`${api}/images/${e.imageName}`} alt="" />
                <button onClick={() => dipathc(delimg(e.id))}>del</button>
              </div>
            })}
          </div>

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose1}>Disagree</Button>
          <Button onClick={handleClose1} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={open2}
        onClose={handleClose2}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"ADD IMAGE"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input type="file" multiple onChange={(e) => setFieldValue("images", e.target.files[0])} />
            <button type="submit">save</button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose2}>Disagree</Button>
          <Button onClick={handleClose2} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default App