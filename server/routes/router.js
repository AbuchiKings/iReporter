import { Router } from 'express';
import incidentApi from './incident';
import usersApi from './users'
import authApi from './userAuth'

const router = Router();
router.get('/', (request, response) => {
    response.status(200).json({
        status: 'success',
        message: 'Welcome to world of awesomeness.'
    });
});

router.use('/api/v1', incidentApi);

router.use('/api/v1', usersApi);

router.use('/api/v1', authApi);

router.all('*', (request, response) => {
    response.status(404).json({
        status: 'error',
        message: `${request.originalUrl} was not found on this platform`
    });
});

export default router;