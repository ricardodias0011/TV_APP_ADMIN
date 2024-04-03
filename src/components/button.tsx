import React from "react";
import { TouchableOpacity, StyleSheet, Text, TouchableOpacityProps } from "react-native";
import { Theme } from "../../theme";

interface ButtonProps extends TouchableOpacityProps {
    variant?: "outline" | "standard",
    color?: string
}

const Button = (props: ButtonProps) => {
    return (
        <TouchableOpacity {...props} style={[
            props?.variant === 'outline' ? {
                borderColor: props?.color ?? Theme.primary,
                borderWidth: 1
        } : 
        {
            backgroundColor: props?.color ?? Theme.primary,
        } ,styles.btn]}>
            {props.children}
        </TouchableOpacity>
    )
}

export default Button;

const styles = StyleSheet.create({
    btnloginText: {
        color: 'white',
        textAlign: 'center'
    },
    btn: {
        width: '100%',
        minWidth: 300,
        padding: 15,
        marginTop: 15,
        borderRadius: 7
    }
})