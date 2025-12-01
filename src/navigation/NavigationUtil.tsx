import { createNavigationContainerRef, CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

// This function used to navigate to a screen in the navigation stack with a given route name and params
export async function navigate(routeName: string, params?: Object) {
    navigationRef.dispatch(CommonActions.navigate( routeName, params ));
}

// This function used to navigates to the previous screen in the navigation stack
export async function navigateBack() {
    navigationRef.dispatch(CommonActions.goBack());
}

// This function used to reset the navigation stack and navigate to a new screen.  
export async function resetStack(routeName: string) {
    navigationRef.dispatch(CommonActions.reset({
        index: 0,
        routes: [{ name: routeName}],
    }));
}