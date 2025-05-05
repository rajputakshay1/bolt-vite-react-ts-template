import { HubVerticalDots, HubCloseIcon } from '../../../../icons';
import './HubGridMoreOptionsCellRenderer.scss';

export interface HubGridMoreOptionsCellRendererProps {
    type?: 'moreOptions' | 'cross' | 'customIcon';
    icon?: JSX.Element;
    'data-qa'?: string;
    'data-test-id'?: string;
}

export const HubGridMoreOptionsCellRenderer = ({
    type,
    icon,
    'data-qa': dataQa,
    'data-test-id': dataTestId,
}: HubGridMoreOptionsCellRendererProps) => {
    return (
        <div
            className='hub_grid_cell--more'
            data-qa={dataQa ? dataQa : 'hub_grid_cell--more'}
            data-testid={dataTestId ? dataTestId : 'hub_grid_cell--more'}
        >
            <span>
                {type === 'moreOptions' && <HubVerticalDots></HubVerticalDots>}
                {type === 'cross' && <HubCloseIcon></HubCloseIcon>}
                {icon && <>{icon}</>}
            </span>
        </div>
    );
};
