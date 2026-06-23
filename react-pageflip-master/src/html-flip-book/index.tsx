import React, {
    isValidElement,
    useCallback,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import type { ReactElement, Ref } from 'react';
import { PageFlip } from 'page-flip';
import type { IFlipSetting, IEventProps } from './settings';

interface IProps extends IFlipSetting, IEventProps {
    className: string;
    style: React.CSSProperties;
    children: React.ReactNode;
    renderOnlyPageLengthChange?: boolean;
}

export interface HTMLFlipBookRef {
    pageFlip: () => PageFlip | undefined;
}

type RefReadyElement = ReactElement<{ ref?: Ref<HTMLElement> }>;

/**
 * Local React 19-compatible wrapper around the repository's PageFlip adapter.
 * The requestAnimationFrame guard caps the legacy renderer at 30fps and stops
 * it completely when the component unmounts or the browser tab is hidden.
 */
const HTMLFlipBookForward = React.forwardRef<HTMLFlipBookRef, IProps>((props, ref) => {
    const htmlElementRef = useRef<HTMLDivElement>(null);
    const childRef = useRef<HTMLElement[]>([]);
    const pageFlip = useRef<PageFlip | undefined>(undefined);
    const [pages, setPages] = useState<ReactElement[]>([]);

    const rafCleanupRef = useRef<(() => void) | null>(null);
    const beginRafGuardRef = useRef<(() => void) | null>(null);
    const endRafGuardRef = useRef<(() => void) | null>(null);

    useImperativeHandle(ref, () => ({
        pageFlip: () => pageFlip.current,
    }), []);

    const refreshOnPageDelete = useCallback(() => {
        pageFlip.current?.clear();
    }, []);

    const removeHandlers = useCallback(() => {
        const flip = pageFlip.current;
        if (!flip) return;
        flip.off('flip');
        flip.off('changeOrientation');
        flip.off('changeState');
        flip.off('init');
        flip.off('update');
    }, []);

    useEffect(() => {
        childRef.current = [];
        const childList = React.Children.toArray(props.children)
            .filter(isValidElement)
            .map((child) => React.cloneElement(child as RefReadyElement, {
                ref: (dom: HTMLElement | null) => {
                    if (dom) childRef.current.push(dom);
                },
            }));

        if (!props.renderOnlyPageLengthChange || pages.length !== childList.length) {
            if (childList.length < pages.length) refreshOnPageDelete();
            setPages(childList);
        }
        // The wrapper intentionally responds to child identity/length changes only.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.children]);

    useEffect(() => {
        const nativeRaf = window.requestAnimationFrame.bind(window);
        const nativeCancel = window.cancelAnimationFrame.bind(window);
        const ownedCallbacks = new WeakSet<FrameRequestCallback>();
        const pendingFrames = new Set<number>();
        let capture = false;
        let alive = true;
        let lastOwnedFrame = 0;

        const guardedRaf: typeof window.requestAnimationFrame = (callback) => {
            if (capture) ownedCallbacks.add(callback);
            const isOwned = ownedCallbacks.has(callback);

            let frameId = 0;
            frameId = nativeRaf((time) => {
                pendingFrames.delete(frameId);
                if (!isOwned) {
                    callback(time);
                    return;
                }
                if (!alive) return;
                if (document.visibilityState !== 'visible') {
                    const resume = () => {
                        if (document.visibilityState === 'visible' && alive) {
                            document.removeEventListener('visibilitychange', resume);
                            window.requestAnimationFrame(callback);
                        }
                    };
                    document.addEventListener('visibilitychange', resume);
                    return;
                }
                if (time - lastOwnedFrame < 1000 / 30) {
                    window.requestAnimationFrame(callback);
                    return;
                }
                lastOwnedFrame = time;
                callback(time);
            });

            if (isOwned) pendingFrames.add(frameId);
            return frameId;
        };

        window.requestAnimationFrame = guardedRaf;
        beginRafGuardRef.current = () => { capture = true; };
        endRafGuardRef.current = () => { capture = false; };
        rafCleanupRef.current = () => {
            alive = false;
            pendingFrames.forEach(nativeCancel);
            pendingFrames.clear();
            if (window.requestAnimationFrame === guardedRaf) {
                window.requestAnimationFrame = nativeRaf;
            }
        };

        return () => {
            rafCleanupRef.current?.();
            rafCleanupRef.current = null;
            beginRafGuardRef.current = null;
            endRafGuardRef.current = null;
        };
    }, []);

    useEffect(() => {
        const setHandlers = () => {
            const flip = pageFlip.current;
            if (!flip) return;

            const onFlip = props.onFlip;
            const onChangeOrientation = props.onChangeOrientation;
            const onChangeState = props.onChangeState;
            const onInit = props.onInit;
            const onUpdate = props.onUpdate;

            if (onFlip) flip.on('flip', (event: unknown) => onFlip(event));
            if (onChangeOrientation) flip.on('changeOrientation', (event: unknown) => onChangeOrientation(event));
            if (onChangeState) flip.on('changeState', (event: unknown) => onChangeState(event));
            if (onInit) flip.on('init', (event: unknown) => onInit(event));
            if (onUpdate) flip.on('update', (event: unknown) => onUpdate(event));
        };

        if (pages.length === 0 || childRef.current.length === 0) return;

        removeHandlers();
        if (htmlElementRef.current && !pageFlip.current) {
            pageFlip.current = new PageFlip(htmlElementRef.current, props);
        }

        const flip = pageFlip.current;
        if (!flip) return;

        beginRafGuardRef.current?.();
        if (!flip.getFlipController()) flip.loadFromHTML(childRef.current);
        else flip.updateFromHtml(childRef.current);
        endRafGuardRef.current?.();
        setHandlers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages]);

    useEffect(() => {
        return () => {
            removeHandlers();
            // UI.destroy removes global mouse/touch/resize listeners without
            // removing the React-owned root node (PageFlip.destroy does both).
            pageFlip.current?.getUI()?.destroy();
            pageFlip.current = undefined;
        };
    }, [removeHandlers]);

    return (
        <div ref={htmlElementRef} className={props.className} style={props.style}>
            {pages}
        </div>
    );
});

HTMLFlipBookForward.displayName = 'HTMLFlipBook';

export const HTMLFlipBook = React.memo(HTMLFlipBookForward);
