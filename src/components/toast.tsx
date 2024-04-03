import { Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast, BaseToastProps } from 'react-native-toast-message';
import { Theme } from '../../theme';
const toastConfig = {
    success: (props: BaseToastProps) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#0EE570', backgroundColor: "#E5FAF7" }}
            contentContainerStyle={{ paddingHorizontal: 15, }}
            text1Style={{
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),

    error: (props: BaseToastProps) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: 'red' }}
            contentContainerStyle={{ paddingHorizontal: 15, backgroundColor: "#FAE5E6" }}
            text1Style={{
                fontSize: 17
            }}
            text2Style={{
                fontSize: 15,
                color: 'black'
            }}
        />
    ),
    tomatoToast: ({ text1, props }: any) => (
        <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
            <Text>{text1}</Text>
            <Text>{props.uuid}</Text>
        </View>
    )
};

export default toastConfig 