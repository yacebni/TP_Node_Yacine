
import express from 'express'
import { filterTours, getMonthlyPlan, getToursStats, getAllToursController, aliasTopTours, getTourByIdController, createTour, updateTourController, checkBody, deleteTour } from '../controllers/tour.controller.js'
import { verifyToken, restrictTo } from '../middleware/auth.middleware.js'
const tourRouter = express.Router()

tourRouter.route('/top-5-cheap')
    .get(aliasTopTours, getAllToursController)

tourRouter
    .route('/')
    .get(getAllToursController)
    .post(verifyToken, createTour)

tourRouter.route('/tour-stats').get(getToursStats)
tourRouter.route('/monthly-plan/:year').get(getMonthlyPlan)
tourRouter.route('/filter').get(filterTours)
tourRouter
    .route('/:id')
    .get(getTourByIdController)
    .put(verifyToken, updateTourController)
    .delete(verifyToken, restrictTo('admin'), deleteTour)

export { tourRouter }
