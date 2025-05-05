import {
    Typography,
    TypographyProps,
    Theme
} from '@mui/material';
import { SxProps } from '@mui/system';

/*
    This component was created as the theme was moved from hub-ui-components to hub-ui-shared, to allow hub-ui-components to be a singleton.
    However, hub-ui-components was unable to detect the custom variants for Typography (e.g. bodySmall)
    To resolve this, we have created HubTypography which has access to the custom variants, which hub-ui-components uses now.
    The MFEs are able to access the custom variants through Typography so we have kept that the same, and only made the change in hub-ui-components.
*/
type HubTypographyProps = React.HTMLProps<HTMLSpanElement> & {
    'data-testid'?: string;
    'data-qa'?: string;
    component?: any;
    align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
      /**
       * The content of the component.
       */
      children?: React.ReactNode;
      /**
       * Override or extend the styles applied to the component.
       */
      classes?: any;
      /**
       * If `true`, the text will have a bottom margin.
       * @default false
       */
      gutterBottom?: boolean;
      /**
       * If `true`, the text will not wrap, but instead will truncate with a text overflow ellipsis.
       *
       * Note that text overflow can only happen with block or inline-block level elements
       * (the element needs to have a width in order to overflow).
       * @default false
       */
      noWrap?: boolean;
      /**
       * If `true`, the element will be a paragraph element.
       * @default false
       */
      paragraph?: boolean;
      /**
       * The system prop that allows defining system overrides as well as additional CSS styles.
       */
    //   sx?: any;
        sx?: SxProps<Theme>;
      /**
       * Applies the theme typography styles.
       * @default 'body1'
       */
      variant?: TypographyProps['variant'] | any;
      /**
       * The component maps the variant prop to a range of different HTML element types.
       * For instance, subtitle1 to `<h6>`.
       * If you wish to change that mapping, you can provide your own.
       * Alternatively, you can use the `component` prop.
       * @default {
       *   h1: 'h1',
       *   h2: 'h2',
       *   h3: 'h3',
       *   h4: 'h4',
       *   h5: 'h5',
       *   h6: 'h6',
       *   subtitle1: 'h6',
       *   subtitle2: 'h6',
       *   body1: 'p',
       *   body2: 'p',
       *   inherit: 'p',
       * }
       */
    // }
}

export function HubTypography(props : HubTypographyProps) {
    return (
            <Typography 
                data-qa={props['data-qa']}
                data-testid={props['data-testid']}
                className={props.className}
                align={props.align}
                sx={props.sx}
                variant={props.variant}
                component={props.component}
                onClick={props.onClick}
                >
                    {props.children}
            </Typography>
    );
}
