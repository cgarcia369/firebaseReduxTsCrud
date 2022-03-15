import * as React from 'react';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {RootReducer} from "../reducers";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Table,
    TableCaption,
    Tbody,
    Td,
    Thead,
    Tr,
    useDisclosure
} from '@chakra-ui/react'
import {GetTodosData, States} from "../reducers/appReducer";
import {createNewTodo, editTodoItem, getTodos, setEditTodoItem} from "../actions/appActions";

const Todos = () => {
    const [inputState, setInputState] = useState<{ title: string }>({
        title: ""
    });
    const [inputStateEdit, setInputStateEdit] = useState<{ title: string }>({
        title: ""
    });
    const {isOpen, onOpen, onClose} = useDisclosure()
    const {isOpen: isOpenEdit, onOpen: onOpenEdit, onClose: onCloseEdit} = useDisclosure()

    const todos = useSelector<RootReducer, {
        state: States | null,
        isLoading: boolean | null,
        data: GetTodosData[] | null,
        hasListener: boolean | null
    }>((store) => store.app.getTodos)
    const create = useSelector<RootReducer, {
        state: States | null,
        isLoading: boolean | null,
    }>((store) => store.app.getTodos.create)
    const edit = useSelector<RootReducer, {
        state: States | null,
        isLoading: boolean | null,
    }>((store) => store.app.getTodos.edit)
    const itemEdit = useSelector<RootReducer, { title: string, id: string }>((store) => store.app.getTodos.itemEdit.data)
    const isAnyLoading = create.isLoading || edit.isLoading
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTodos())
    }, [])
    useEffect(() => {
        if (itemEdit && itemEdit.hasOwnProperty('title')) {
            setInputStateEdit({title: itemEdit.title})
        }
    }, [itemEdit])
    if (todos.state === States.loading) {
        return null;
    }
    const handleChange = (e: any) => {
        e.preventDefault();
        setInputState({...inputState, [e.target.name]: e.target.value})
    }
    const handleCreate = () => {
        dispatch(createNewTodo(inputState.title))
        setInputState({title: ''})
        onClose()
    }
    const handleChangeEdit = (e: any) => {
        e.preventDefault();
        setInputStateEdit({...inputStateEdit, [e.target.name]: e.target.value})
    }
    const handleEdit = async () => {
        dispatch(editTodoItem({title: inputStateEdit.title, id: itemEdit.id}))
        onCloseEdit()
    }
    return (
        <>
            {
                isAnyLoading &&
                <Box zIndex={9999} position="absolute" w="100vw" h="100vh" display="flex" justifyContent="center"
                     alignItems="center"
                     bgColor="white">
                    <CircularProgress isIndeterminate color='green.300'/>
                </Box>
            }

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Create new todo</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input value={inputState.title} name="title" onChange={handleChange} placeholder='Title'/>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button variant='ghost' onClick={handleCreate}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Modal isOpen={isOpenEdit} onClose={onCloseEdit}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Edit item todo</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <FormControl>
                            <FormLabel>Title</FormLabel>
                            <Input value={inputStateEdit.title} name="title" onChange={handleChangeEdit}
                                   placeholder='Title'/>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={onCloseEdit}>
                            Close
                        </Button>
                        <Button variant='ghost' onClick={handleEdit}>Edit</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box w="50vw" h="80vh" m="auto" display="flex" flexDirection="column" justifyContent="center"
                 alignItems="center" overflow="auto">
                <Heading>Todos Data</Heading>
                <Box w="100%" h="80%">
                    <Table h="96" variant="simple">
                        <TableCaption><Button colorScheme='teal' size='lg' onClick={onOpen}>Agregar nuevo todo</Button></TableCaption>
                        <Thead>
                            <Tr>
                                <Td>Title</Td>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {
                                Array.isArray(todos.data) && todos.data.map(x => {
                                    return (
                                        <>
                                            <Tr onClick={
                                                async () => {
                                                    await dispatch(setEditTodoItem(x.id))
                                                    onOpenEdit()
                                                }
                                            }>
                                                <Td>
                                                    {x.title}
                                                </Td>
                                            </Tr>

                                        </>
                                    )
                                })
                            }
                        </Tbody>
                    </Table>
                </Box>
            </Box>
        </>
    );
};
export default Todos;