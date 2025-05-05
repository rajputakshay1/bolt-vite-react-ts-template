import { HubErrorIconOutline, HubProgressBarRoundIcon } from '../../../icons';
import './HubGridCustomOverlay.scss';
import { HubTypography } from '@hub/hub-ui-shared';

export interface HubGridCustomOverlayProps {
    message?: string;
    classes?: string;
    secondaryText?: string;
    icon?: JSX.Element;
}

export const HubGridCustomOverlay = (props: HubGridCustomOverlayProps) => {
    function getOverlayIcon() {
        let icon: JSX.Element;
        if (props.icon) {
            icon = props.icon;
        } else if (props.classes?.includes('error')) {
            icon = <HubErrorIconOutline />;
        } else {
            icon = <HubProgressBarRoundIcon />;
        }
        return <span>{icon}</span>;
    }
    return (
        <HubTypography
            variant='titleLarge'
            className={`hub_custom_overlay ${props.classes}`}
            component='div'
            data-qa='overlay-wrapper'
        >
            <div className='primary-section'>
                {getOverlayIcon()}
                <span>{props.message}</span>
            </div>
            {props.secondaryText && <div className='secondary-section'>{props.secondaryText}</div>}
        </HubTypography>
    );
};
