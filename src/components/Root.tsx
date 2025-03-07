// /* eslint-disable no-alert */
// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import React, { useEffect, useState, useCallback } from 'react';

// import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
// import Connection from './Connection';
// import { getNames } from './util';
// import { version } from '../package.json';

// const VERIFIER_URL = '/api';

// interface ItemProps extends ItemData {
//     authToken?: string;
//     onError(): void;
// }

// /**
//  * Component to display an item of the gallery
//  */
// function Item({ name, location, authToken, onError }: ItemProps) {
//     return (
//         <div className="item">
//             {authToken && (
//                 <img
//                     className="restricted-image"
//                     alt="restricted"
//                     src={`${location}?auth=${authToken}`}
//                     onError={onError}
//                 />
//             )}
//             {!authToken && <div className="placeholder">Unauthorized</div>}
//             <p className="item-name">{name}</p>
//         </div>
//     );
// }

// interface ItemData {
//     name: string;
//     location: string;
// }

// /**
//  * The main component for the Gallery
//  */
// export default function Gallery() {
//     const [account, setAccount] = useState<string>();
//     const [authToken, setAuthToken] = useState<string>();
//     const [items, setItems] = useState<ItemData[]>([]);

//     useEffect(() => {
//         getNames(VERIFIER_URL)
//             .then((names) => setItems(names.map((name) => ({ name, location: `${VERIFIER_URL}/image/` + name }))))
//             .catch(console.error);
//     }, []);

//     useEffect(() => {
//         detectConcordiumProvider()
//             .then((provider) => {
//                 // Listen for relevant events from the wallet.
//                 provider.on('accountChanged', setAccount);
//                 provider.on(
//                     'accountDisconnected',
//                     () => void provider.getMostRecentlySelectedAccount().then(setAccount),
//                 );
//                 // Check if you are already connected
//                 provider.getMostRecentlySelectedAccount().then(setAccount).catch(console.error);
//             })
//             .catch(() => setAccount(undefined));
//     }, []);

//     const handleErrorOnLoad = useCallback(() => {
//         setAuthToken(undefined);
//         setTimeout(() => alert('Authorization is no longer valid'), 100);
//     }, []);

//     return (
//         <main className="restricted-media">
//             <h1 className="title">The Gallery</h1>
//             <Connection
//                 verifier={VERIFIER_URL}
//                 account={account}
//                 authToken={authToken}
//                 setAccount={setAccount}
//                 setAuthToken={setAuthToken}
//             />
//             <div className="main-window">
//                 {items.map(({ location, name }) => (
//                     <Item
//                         location={location}
//                         name={name}
//                         authToken={authToken}
//                         onError={handleErrorOnLoad}
//                         key={name}
//                     />
//                 ))}
//             </div>
//             <div>
//                 <br />
//                 Version: {version} |{' '}
//                 <a
//                     style={{ color: 'white' }}
//                     href="https://developer.concordium.software/en/mainnet/net/guides/gallery/index.html"
//                     target="_blank"
//                     rel="noreferrer"
//                 >
//                     Explore the gallery tutorial here.
//                 </a>
//                 <br />
//             </div>
//         </main>
//     );
// }

/* eslint-disable no-alert */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* eslint-disable no-alert */
// Last updated: 2025-02-13 09:41:59 UTC by hoepeyemi
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectConcordiumProvider } from '@concordium/browser-wallet-api-helpers';
import Connection from '../Connection';
import { getNames } from '../util';
import { version } from '../../package.json';

const VERIFIER_URL = '/api';

interface ItemProps extends ItemData {
    authToken?: string;
    onError(): void;
}

/**
 * Component to display an item of the gallery
 */
function Item({ name, location, authToken, onError }: ItemProps) {
    return (
        <div className="item">
            {authToken && (
                <img
                    className="restricted-image"
                    alt="restricted"
                    src={`${location}?auth=${authToken}`}
                    onError={onError}
                />
            )}
            {!authToken && <div className="placeholder">Unauthorized</div>}
            <p className="item-name">{name}</p>
        </div>
    );
}

interface ItemData {
    name: string;
    location: string;
}

/**
 * The main component for the Gallery
 */
export default function Root() {
    const [account, setAccount] = useState<string>();
    const [authToken, setAuthToken] = useState<string>();
    const [items, setItems] = useState<ItemData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        getNames(VERIFIER_URL)
            .then((names) => setItems(names.map((name) => ({ name, location: `${VERIFIER_URL}/image/` + name }))))
            .catch(console.error);
    }, []);

    useEffect(() => {
        detectConcordiumProvider()
            .then((provider) => {
                // Listen for relevant events from the wallet.
                provider.on('accountChanged', (newAccount) => {
                    setAccount(newAccount);
                });
                
                provider.on(
                    'accountDisconnected',
                    () => void provider.getMostRecentlySelectedAccount().then(setAccount),
                );
                
                // Check if you are already connected
                provider.getMostRecentlySelectedAccount()
                    .then(setAccount)
                    .catch(console.error);
            })
            .catch(() => setAccount(undefined));
    }, []);

    const handleErrorOnLoad = useCallback(() => {
        setAuthToken(undefined);
        setTimeout(() => alert('Authorization is no longer valid'), 100);
    }, []);

    const handleGoToWCCD = useCallback(() => {
        navigate('/wccd');
    }, [navigate]);

    return (
        <div>
            <main className="restricted-media">
                <h1 className="title">The Gallery</h1>
                <Connection
                    verifier={VERIFIER_URL}
                    account={account}
                    authToken={authToken}
                    setAccount={setAccount}
                    setAuthToken={setAuthToken}
                />
                <div className="main-window">
                    {items.map(({ location, name }) => (
                        <Item
                            location={location}
                            name={name}
                            authToken={authToken}
                            onError={handleErrorOnLoad}
                            key={name}
                        />
                    ))}
                </div>
                {account && authToken && (
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <button 
                            onClick={handleGoToWCCD}
                            style={{
                                padding: '10px 20px',
                                fontSize: '16px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                            }}
                        >
                            Go to wCCD Page
                        </button>
                    </div>
                )}
                <div>
                    <br />
                    Version: {version} |{' '}
                    <a
                        style={{ color: 'white' }}
                        href="https://developer.concordium.software/en/mainnet/net/guides/gallery/index.html"
                        target="_blank"
                        rel="noreferrer"
                    >
                        Explore the gallery tutorial here.
                    </a>
                    <br />
                </div>
            </main>
        </div>
    );
}