import { app } from './app';
import { env } from './env';

import { userTransactionsRoutes } from './routes/users-transactions';
import { mealTransactionsRoutes } from './routes/meals-transactions';

app.register(userTransactionsRoutes, {
    prefix: 'users',
});
app.register(mealTransactionsRoutes, {
    prefix: 'meals',
});

app.listen({
    port: env.PORT,
})
.then(() => {
    console.log('Server HTTP Running! ✅');
});
