import Router from 'express'
import { User } from '../model/user.model'

const utilityRouter = Router()

utilityRouter.get('/get-user-with-id', async (req, res) => {
  try {
    const users = await User.findById(req.query.id).select('-password') 
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  } 
})

utilityRouter.get('/get-user-for-sidebar', async (req, res) => {
  const RequestUserId = req.user?.id;
  try {
    let users = await User.find().select('username profilePhoto').where('_id').ne(RequestUserId);
    
    res.json({
      users
    })
  } catch (error) {
    res.status(500).json({ message: 'Server Error' })
  }
})

export default utilityRouter