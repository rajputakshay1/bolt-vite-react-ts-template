import { useState } from 'react';
import {
    ClickAwayListener,
    easing,
    Fade,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
} from '@mui/material';
import Slide from '@mui/material/Slide';
import Grow from '@mui/material/Grow';
import Popper from '@mui/material/Popper';
import IconButton from '@mui/material/IconButton';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './HubNavbar.scss';
import { composeDataQaValue, findEventTarget } from './utilities/formatters/formatters';
import { HubPinIcon } from './uiComponents/icons/monochrome/HubPinIcon';
import { HubPinIconFilled } from './uiComponents/icons/monochrome/HubPinIconFilled';
import { HubTypography } from './molecules/HubTypography/HubTypography';

export interface MenuItem {
    identifier: string;
    label: string;
    icon?: JSX.Element;
    iconLabel?: string;
    entryPoint: string;
    items?: MenuItem[];
    disabled?: boolean;
}
export interface HubNavBarProps {
    menuItems: MenuItem[];
    handleNavClick?: () => void;
}

function isPathActive(pathname: string, menuItem: MenuItem): boolean {
    if (
        pathname == '/' &&
        (menuItem.entryPoint == '/clientreporting' ||
            menuItem.entryPoint == '/clientreporting/reports')
    )
        return true;
    else if (menuItem.items && pathname.startsWith(menuItem.entryPoint)) return true;
    else return pathname === menuItem.entryPoint;
}

export function HubNavBar(props: HubNavBarProps) {
    const [displaySubNav, setDisplaySubNav] = useState(false);
    const [subNavItem, setSubNavItem] = useState<MenuItem | null>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
    const [isPinnedSubNav, setIsPinnedSubNav] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavItemClick = (event: MouseEvent, menuItem: MenuItem) => {
        const { targetElem } = findEventTarget(event, '.hub_navbar .MuiListItem-button');
        if(props.handleNavClick){
            props.handleNavClick();
        }
        if (menuItem.items) {
            setAnchorEl(targetElem as HTMLElement);
            if (displaySubNav) {
                if (subNavItem && subNavItem.identifier === menuItem.identifier) {
                    setDisplaySubNav(false);
                    setSelectedMenu(null);
                } else {
                    setSubNavItem(menuItem);
                    setSelectedMenu(menuItem);
                }
            } else {
                setSubNavItem(menuItem);

                setDisplaySubNav((prevState) => !prevState);

                setSelectedMenu(menuItem);
            }
        } else if (menuItem.entryPoint) {
            setDisplaySubNav(false);
            navigate(menuItem.entryPoint);
            setSelectedMenu(menuItem);
        }
    };

    const handleClickAway = () => {
        if (displaySubNav && !isPinnedSubNav) {
            setDisplaySubNav(false);
            setSelectedMenu(null);
        }
    };

    const handleSubNavSelectionChange = () => {
        if (!isPinnedSubNav) {
            setDisplaySubNav(false);
        }
    };

    const isSelectedNavItem = (menuItem: MenuItem) => {
        const currentPath = location.pathname;

        if (selectedMenu === menuItem) {
            return true;
        } else if (!selectedMenu && selectedMenu !== menuItem) {
            return isPathActive(currentPath, menuItem);
        }
    };

    const onPinClick = () => {
        setIsPinnedSubNav((prevState) => !prevState);
    };

    return (
        <ClickAwayListener onClickAway={handleClickAway}>
            <div className='d-flex'>
                <div className='hub_navbar' data-qa='hub_navabr'>
                    {props.menuItems.map((item: any, index, items) => (
                        <ListItem
                            button
                            sx={{
                                '&.Mui-disabled': {
                                    opacity: 1,
                                },
                            }}
                            disabled={item.disabled}
                            key={index}
                            selected={isSelectedNavItem(item)}
                            onClick={(event: any) => handleNavItemClick(event, item)}
                            data-qa={'hub_' + composeDataQaValue(item.label)}
                            className={
                                isPathActive(location.pathname, item)
                                    ? 'hub_navbar_default-selected'
                                    : ''
                            }
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <HubTypography variant='compactSmall' className='nav_icon-label'>
                                {item.iconLabel}
                            </HubTypography>
                        </ListItem>
                    ))}
                </div>
                <SubNavSlide
                    displayNav={displaySubNav}
                    menuItem={subNavItem}
                    onSelectionChange={handleSubNavSelectionChange}
                    anchorEl={anchorEl}
                    onPinClick={onPinClick}
                    isPinned={isPinnedSubNav}
                ></SubNavSlide>
            </div>
        </ClickAwayListener>
    );
}

interface SubNavSlideProps {
    displayNav: boolean;
    isPinned: boolean;
    menuItem?: MenuItem | null;
    onSelectionChange: Function;
    anchorEl: HTMLElement | null;
    onPinClick: Function;
}

function SubNavSlide(props: SubNavSlideProps) {
    return (
        <>
            {!props.isPinned && (
                <Popper
                    className='hub_subnavbar-popper'
                    open={props.displayNav}
                    anchorEl={props.anchorEl}
                    placement='right-start'
                    modifiers={[
                        {
                            name: 'offset',
                            options: {
                                offset: [-30, 12],
                            },
                        },
                    ]}
                    disablePortal={true}
                    transition
                >
                    {({ TransitionProps }) => (
                        <Grow
                            {...TransitionProps}
                            timeout={{ enter: 400, exit: 3000 }}
                            easing={{ exit: easing.easeOut, enter: easing.easeOut }}
                            style={{ transitionDelay: '1ms', transformOrigin: 'top left' }}
                        >
                            <div>
                                <Fade
                                    {...TransitionProps}
                                    timeout={{ enter: 400, exit: 100 }}
                                    easing={{ exit: easing.easeOut, enter: easing.easeOut }}
                                    style={{ transitionDelay: '1ms' }}
                                >
                                    <div>
                                        <SubNavBar
                                            menuItem={props.menuItem}
                                            onSelectionChange={props.onSelectionChange}
                                            onPinClick={props.onPinClick}
                                            isPinned={props.isPinned}
                                        />
                                    </div>
                                </Fade>
                            </div>
                        </Grow>
                    )}
                </Popper>
            )}

            {props.isPinned && props.displayNav && (
                <Slide direction='right' in={props.isPinned} easing={easing.easeOut} timeout={200}>
                    <div>
                        <SubNavBar
                            menuItem={props.menuItem}
                            onSelectionChange={props.onSelectionChange}
                            onPinClick={props.onPinClick}
                            isPinned={props.isPinned}
                        />
                    </div>
                </Slide>
            )}
        </>
    );
}

interface SubNavBarProps {
    menuItem?: MenuItem | null;
    onSelectionChange: Function;
    onPinClick: Function;
    isPinned?: boolean;
}

function SubNavBar(props: SubNavBarProps) {
    const location = useLocation();
    const handleListItemClick = () => {
        props.onSelectionChange();
    };

    const onPinClick = () => {
        props.onPinClick();
    };

    return (
        <div
            className={'hub_subnavbar ' + (props.isPinned ? 'hub_subnavbar-pinned' : '')}
            data-qa='hub_subnavbar'
        >
            <IconButton size='small' className='hub_subnavbar-pin' onClick={onPinClick}>
                {props.isPinned ? <HubPinIconFilled /> : <HubPinIcon />}
            </IconButton>
            <h2 className='hub_subnavbar-title' data-qa='hub_subnavbar-title'>
                {props.menuItem?.label}
            </h2>
            <List>
                {props.menuItem?.items?.map((item: any, index: number) => (
                    <ListItem key={index}>
                        <ListItemButton
                            sx={{
                                '&.Mui-disabled': {
                                    opacity: 1,
                                },
                            }}
                            disabled={item.disabled}
                            selected={isPathActive(location.pathname, item)}
                            onClick={handleListItemClick}
                            data-qa={'hub_' + composeDataQaValue(item.label)}
                        >
                            <Link to={item.entryPoint}>{item.label}</Link>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );
}
