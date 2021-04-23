import app from './app'
const PORT = app.get('port');
import './database'

app.listen(app.get('port'), () => console.log(`Server corriendo en el puerto ${PORT}`));
