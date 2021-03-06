import { createContext, useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const FeedbackContext = createContext()


export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState([])
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false
  })

  useEffect(() => {
    fetchFeedback()
    setIsLoading(false)
  }, [])

  //FETCH FEEDBACK
  const fetchFeedback = async () => {
    const response = await fetch(`http://localhost:3004/feedback?_sort=id&_order=desc`)
    const data = await response.json()
    setFeedback(data)
  }


  // ADD
  // const addFeedback = (newFeedback) => {
  //   newFeedback.id = uuidv4()
  //   setFeedback([newFeedback, ...feedback])
  // }
  const addFeedback = async (newFeedback) => {
    const response = await fetch('http://localhost:3004/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newFeedback),
    })

    const data = await response.json()

    setFeedback([data, ...feedback])
  }

  //  DELETE
  // const deleteFeedback = (id) => {
  //   //! подтверждение удаления
  //   if (window.confirm('Are you sure you want to delete?')) {
  //     setFeedback(feedback.filter((item) => item.id !== id))
  //   }

  // }

  const deleteFeedback = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`http://localhost:3004/feedback/${id}`, { method: 'DELETE' })

      setFeedback(feedback.filter((item) => item.id !== id))
    }
  }

  // EDIT
  const editFeedback = (item) => {
    setFeedbackEdit({
      item,
      edit: true
    })
  }

  // UPDATE AFTER EDIT
  // const updateFeedback = (id, updItem) => {
  //   // console.log(id, updItem)
  //   setFeedback(feedback.map((item) => item.id === id ? { ...item, ...updItem } : item))
  // }
  const updateFeedback = async (id, updItem) => {
    const response = await fetch(`http://localhost:3004/feedback/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updItem),
    })

    const data = await response.json()

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    )
  }
  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  )
}

export default FeedbackContext