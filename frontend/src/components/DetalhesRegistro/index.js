import PropTypes from 'prop-types';
import { useState } from 'react';
import { Typography, Box } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles';

function DetalhesRegistro( { classes, title, registro, data, setButtonsDisabled, setDataValidacao } ){

    const [conhecimentos, setConhecimentos] = useState([...registro.conhecimentos])

    const filtraConhecimentos = (e) => {
        return e !== '[' && e !== '"' && e !== ']';
    }

    return(
        <>
            <Typography
                className={classes.titleStyle}
                variant="h4"
            >
                {title}
            </Typography>
            <Box>
                <Typography className={classes.infoLine} variant="h6">Nome: {registro.nome}</Typography>
                <Typography className={classes.infoLine} variant="h6">Email: {registro.email}</Typography>
                <Typography className={classes.infoLine} variant="h6">CPF: {registro.cpf}</Typography>
                <Typography className={classes.infoLine} variant="h6">Data: {data}</Typography>
                {registro.celular !== '' ?
                    <Typography className={classes.infoLine} variant="h6">Celular: {registro.celular}</Typography>
                                        :
                    null
                }
                {conhecimentos !== [] ?
                    <Typography className={classes.infoLine} variant="h6">Conhecimentos: { conhecimentos.filter(filtraConhecimentos) }</Typography>
                                        :
                    null
                }
                <Typography className={classes.infoLine} variant="h6">Tipo de Validação: {registro.validado === 'N' ? 'Não Validado' : 'Validado'}</Typography>
            </Box>
        </>
    )
}

DetalhesRegistro.propTypes = {
    classes: PropTypes.object.isRequired
}

const styles = { 
    infoLine: {
        margin: '0.8em 0',
    },
    titleStyle: {
        textAlign: 'center',
        margin: '0.8em 0',
    },
}

export default withStyles(styles)(DetalhesRegistro);