import ReactDOMServer from 'react-dom/server';
import { AgGridReact } from 'ag-grid-react';
import { GridOptions } from 'ag-grid-community';
import 'ag-grid-enterprise';

import { HubSortIcon } from '../../icons/monochrome/HubSortIcon';
import './HubGrid.scss';
import {
    HubGridCustomOverlay,
    HubGridCustomOverlayProps,
} from './HubGridOverlays/HubGridCustomOverlay';
import { useTranslation } from 'react-i18next';

export enum HubGridSupportedThemes {
    balham = 'ag-theme-balham',
    material = 'ag-theme-material',
    alpine = 'ag-theme-alpine',
    alpineCompact = 'ag-theme-alpine compact'
}
export interface HubGridProps extends GridOptions {
    classes?: string;
    id?: string;
    rowData?: any[];
    rowModelType?: 'clientSide' | 'infinite' | 'viewport' | 'serverSide';
    noColumns?: boolean;
    hideNoResultsMessage?: boolean;
    noRowsOverlayProps?: HubGridCustomOverlayProps;
    theme?: HubGridSupportedThemes;
}

/**
 * HubGrid is a component based on https://www.ag-grid.com/react-data-grid/. All props applicable to AG Grid are applicable here too.
 * @param {HubGridProps} props
 * @returns {any}
 */
export const HubGrid = (props: HubGridProps) => {
    const { t } = useTranslation();
    const noRowsOverlayComponent = () => {
        return (
            <div>
                {!props.hideNoResultsMessage && (
                    <HubGridCustomOverlay
                        icon={props.noRowsOverlayProps?.icon}
                        secondaryText={props.noRowsOverlayProps?.secondaryText}
                        message={
                            props.noRowsOverlayProps?.message
                                ? props.noRowsOverlayProps.message
                                : t('components.hub-grid.no-results')
                        }
                        classes={
                            props.noRowsOverlayProps?.classes
                                ? props.noRowsOverlayProps.classes
                                : 'error'
                        }
                    ></HubGridCustomOverlay>
                )}
            </div>
        );
    };

    const loadingOverlayComponent = () => {
        return (
            <HubGridCustomOverlay
                message={t('components.hub-grid.loading')}
                classes='progress'
            ></HubGridCustomOverlay>
        );
    };

    return (
        <div
            id={props.id}
            className={`hub_grid ${props.theme ? props.theme : HubGridSupportedThemes.material} ${
                props.classes
            }`}
        >
            <AgGridReact
                suppressServerSideInfiniteScroll={false}
                cacheBlockSize={100}
                rowData={props.rowData}
                suppressRowHoverHighlight={true}
                noRowsOverlayComponent={noRowsOverlayComponent}
                loadingOverlayComponent={loadingOverlayComponent}
                {...props}
                headerHeight={props.noColumns ? 0 : undefined}
                rowModelType={props.rowModelType ? props.rowModelType : 'serverSide'}
                defaultColDef={{
                    width: 180,
                    sortable: true,
                    resizable: true,
                    headerComponentParams: {
                        template: `<div class='ag-cell-label-container' role='presentation' data-qa='ag-header-cell'>  
            <span ref='eMenu' class='ag-header-icon ag-header-cell-menu-button'></span>  
            <div class='sort-icon'>${ReactDOMServer.renderToString(<HubSortIcon />)}</div>
                <div ref='eLabel' class='ag-header-cell-label' role='presentation'>
                <span ref='eText' class='ag-header-cell-text' role='columnheader'></span> 
                <span ref='eFilter' class='ag-header-icon ag-filter-icon'></span>  
                </div>
                </div>`,
                    },
                    ...props.defaultColDef,
                }}
            ></AgGridReact>
        </div>
    );
};
