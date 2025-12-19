import { useDispatch, useSelector } from 'react-redux'
import {
  addimg,
  addTodo,
  api,
  checkTodo,
  delimg,
  delTodo,
  editTodo,
  getTodo,
  infoTodo
} from './reduce/api'
import "./App.css"
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { useEffect, useState } from "react"
import { useFormik } from "formik"
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material"

import type { RootState, AppDispatch } from "./store/store"

interface FormValues {
  id?: number
  name: string
  description: string
  isCompleated: boolean
  images?: File[]
}

const App = () => {
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [idx, setidz] = useState<number | null>(null)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }

  const handleClickOpen1 = () => setOpen1(true)
  const handleClose1 = () => setOpen1(false)

  const handleClickOpen2 = () => setOpen2(true)
  const handleClose2 = () => setOpen2(false)

  const { data, info, loading } = useSelector(
    (state: RootState) => state.todo
  )

  const dipathc = useDispatch<AppDispatch>()

  useEffect(() => {
    dipathc(getTodo())
  }, [dipathc])

  const {
    handleChange,
    handleSubmit,
    resetForm,
    values,
    setFieldValue
  } = useFormik<FormValues>({
    initialValues: {
      name: "",
      description: "",
      isCompleated: false,
      images: []
    },
    onSubmit: (values) => {
      let formdata = new FormData();

      if (values.id) {
        dipathc(editTodo(values));
      } else if (idx && values.images && values.images.length > 0) {
        dipathc(addimg({ id: idx, images: values.images }));
      } else {
        formdata.append("name", values.name);
        formdata.append("description", values.description);

        if (values.images && values.images.length > 0) {
          for (let i = 0; i < values.images.length; i++) {
            formdata.append("images", values.images[i]);
          }
        }

        dipathc(addTodo(formdata));
      }

      handleClose();
      resetForm();
    }

  })

  const handlefield = (e: any) => {
    handleClickOpen()
    setFieldValue("name", e.name)
    setFieldValue("description", e.description)
    setFieldValue("id", e.id)
  }

  const [search, setSearch] = useState("")
  const [filterstatus, setFilterstatus] = useState("0")

  const filteruser = data.filter((todo: any) =>
    todo?.name?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return <CircularProgress disableShrink />
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }}>
      <Button variant="outlined" onClick={handleClickOpen}>Open alert dialog</Button>

      <select value={filterstatus} onChange={(e) => setFilterstatus(e.target.value)}>
        <option value="0">All</option>
        <option value="1">Active</option>
        <option value="2">Inactive</option>
      </select>

      <input
        type="search"
        placeholder="search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {values.id ? "edit user" : "add user"}
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input name="name" value={values.name} onChange={handleChange} />
            <input name="description" value={values.description} onChange={handleChange} />
            <input
              type="file"
              onChange={(e) => {
                if (e.target.files) {
                  setFieldValue("images", [e.target.files[0]])
                }
              }}
            />
            <button type="submit">save</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell>name</TableCell>
              <TableCell>description</TableCell>
              <TableCell>status</TableCell>
              <TableCell>action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteruser
              .filter((e: any) =>
                filterstatus === "0"
                  ? true
                  : filterstatus === "1"
                    ? e.isCompleted
                    : !e.isCompleted
              )
              .map((e: any) => (
                <TableRow key={e.id}>
                  <TableCell>{e.id}</TableCell>
                  <TableCell>{e.name}</TableCell>
                  <TableCell>{e.description}</TableCell>
                  <TableCell>{e.isCompleted ? "active" : "inactive"}</TableCell>
                  <TableCell>
                    <button onClick={() => handlefield(e)}>edit</button>
                    <button onClick={() => dipathc(delTodo(e.id))}>del</button>
                    <button onClick={() => {
                      dipathc(infoTodo(e.id))
                      handleClickOpen1()
                    }}>info</button>
                    <input
                      type="checkbox"
                      checked={e.isCompleted}
                      onClick={() => dipathc(checkTodo(e))}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open1} onClose={handleClose1}>
        <DialogTitle>INFO</DialogTitle>
        <DialogContent>
          {info && (
            <>
              <h1>{info.name}</h1>
              <h1>{info.description}</h1>
              <button onClick={() => {
                if (info) setidz(info.id)
                handleClickOpen2()
              }}>add Image</button>

              <div style={{ display: "flex", gap: "10px" }}>
                {info.images.map((e) => (
                  <div key={e.id}>
                    <img src={`${api}/images/${e.imageName}`} width={200} />
                    <button onClick={() => dipathc(delimg(e.id))}>del</button>
                  </div>
                ))}
              </div>
            </>
          )}

        </DialogContent>
      </Dialog>

      <Dialog open={open2} onClose={handleClose2}>
        <DialogTitle>ADD IMAGE</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <input
              type="file"
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  setFieldValue("images", Array.from(e.target.files))
                }
              }}
            />
            <button type="submit">save</button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App
