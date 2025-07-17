import 'react-router-dom';

declare module 'react-router-dom' {
    import {FC} from 'react';
    import {RedirectProps as OriginalRedirectProps, RouteProps as OriginalRouteProps} from 'react-router';

    // Override Route component to accept exact prop
    export interface RouteProps extends OriginalRouteProps {
        exact?: boolean;
        strict?: boolean;
        sensitive?: boolean;
        children?: React.ReactNode;
    }

    // Export Redirect component
    export const Redirect: FC<OriginalRedirectProps>;

    // Re-export Route with updated props
    export const Route: FC<RouteProps>;
}

// Fix for React 19 ReactNode compatibility
declare module 'react' {
    interface ReactPortal {
        children?: ReactNode;
    }
} 
