import { useState } from 'react';

function Login(){
    const [email,setEmail] = useState('');
    const [passwd,setPasswd] = useState('');
    const [nombre,setNombre] = useState('');

    return(
        <div style={{minHeight: "70vh", display: "flex", justifyContent: "center",alignItems: "center"}}>

            <div style={{marginRight:"auto",marginBottom:"auto",border:"2px solid black",width:"200px",height:"600px",overflow:"hidden"}}>
                <img src="imagen_por_peli/peaky_blinders.webp" alt="Peaky Blinders"
                    style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>

            <div style={{width: "350px",padding: "30px",border: "2px solid black",borderRadius: "8px", backgroundColor:"#72d8d8ff"}}>
                <h2 style={{textAlign:"center"}}>Login</h2>

                <form>
                    <div style={{marginBottom:"15px"}}>
                        <label>Nombre:</label>
                        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required style={{width:"100%"}}/>
                    </div>
                    
                    <div style={{marginBottom:"15px"}}>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{width:"100%"}}/>
                    </div>

                    <div style={{marginBottom:"15px"}}>
                        <label>Contraseña:</label>
                        <input type="password" value={passwd} onChange={e => setPasswd(e.target.value)} required style={{width:"100%"}}/>
                    </div>

                    <div style={{textAlign:"center"}}>
                        <button type='submit'>
                            Vamos!!
                        </button>
                    </div>
                </form>
            </div>

            <div 
                style={{marginLeft:"auto",marginBottom:"auto",border:"2px solid black",width:"200px",height:"600px",overflow:"hidden"}}>
                <img src="imagen_por_peli/peaky_blinders.webp"
                    alt="Peaky Blinders" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            </div>
        </div>
    )
}

export default Login;