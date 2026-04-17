// // // import React, { useState, useEffect } from 'react';
// // // import { toast } from 'react-hot-toast';

// // // function Login({ onLogin }) {
// // //     const [credentials, setCredentials] = useState({
// // //         username: '',
// // //         password: ''
// // //     });

// // //     useEffect(() => {
// // //         const handleKeyPress = (e) => {
// // //             if (e.key === 'Enter') {
// // //                 handleLogin();
// // //             }
// // //         };

// // //         window.addEventListener('keypress', handleKeyPress);
// // //         return () => window.removeEventListener('keypress', handleKeyPress);
// // //     }, [credentials]);

// // //     const handleLogin = async () => {
// // //         if (!credentials.username || !credentials.password) {
// // //             toast.error('Please enter username and password');
// // //             return;
// // //         }

// // //         try {
// // //             // For demo, accept admin/admin123
// // //             if (credentials.username === 'admin' && credentials.password === 'admin123') {
// // //                 onLogin({ username: 'admin', full_name: 'Administrator', role: 'admin' });
// // //             } else {
// // //                 toast.error('Invalid credentials');
// // //             }
// // //         } catch (error) {
// // //             toast.error('Login failed');
// // //         }
// // //     };

// // //     return (
// // //         <div className="login-container">
// // //             <div className="login-box">
// // //                 <h2>Inventory Management System</h2>
// // //                 <div className="form-group">
// // //                     <label>Username</label>
// // //                     <input
// // //                         type="text"
// // //                         value={credentials.username}
// // //                         onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
// // //                         placeholder="Enter username"
// // //                         autoFocus
// // //                     />
// // //                 </div>
// // //                 <div className="form-group">
// // //                     <label>Password</label>
// // //                     <input
// // //                         type="password"
// // //                         value={credentials.password}
// // //                         onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
// // //                         placeholder="Enter password"
// // //                     />
// // //                 </div>
// // //                 <button className="btn-primary" onClick={handleLogin}>
// // //                     Login
// // //                 </button>
// // //                 <div className="shortcuts-hint" style={{ marginTop: '15px', textAlign: 'center' }}>
// // //                     Press Enter to login
// // //                 </div>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export default Login;

// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { toast } from 'react-hot-toast';
// // // import './login.css';
// // // function Login({ onLogin }) {
// // //     const [credentials, setCredentials] = useState({
// // //         username: '',
// // //         password: ''
// // //     });
// // //     const [loading, setLoading] = useState(false);
// // //     const [showPassword, setShowPassword] = useState(false);
// // //     const [focusedField, setFocusedField] = useState(null);
// // //     const [rememberMe, setRememberMe] = useState(false);
// // //     const usernameRef = useRef(null);
// // //     const passwordRef = useRef(null);

// // //     useEffect(() => {
// // //         // Auto-focus username field on mount
// // //         if (usernameRef.current) {
// // //             usernameRef.current.focus();
// // //         }

// // //         // Load remembered username if exists
// // //         const rememberedUsername = localStorage.getItem('remembered_username');
// // //         if (rememberedUsername) {
// // //             setCredentials(prev => ({ ...prev, username: rememberedUsername }));
// // //             setRememberMe(true);
// // //         }
// // //     }, []);

// // //     useEffect(() => {
// // //         const handleKeyPress = (e) => {
// // //             if (e.key === 'Enter' && !loading) {
// // //                 handleLogin();
// // //             }
// // //         };

// // //         window.addEventListener('keypress', handleKeyPress);
// // //         return () => window.removeEventListener('keypress', handleKeyPress);
// // //     }, [credentials, loading]);

// // //     const handleLogin = async () => {
// // //         if (!credentials.username || !credentials.password) {
// // //             toast.error('Please enter both username and password', {
// // //                 icon: '⚠️',
// // //                 style: {
// // //                     background: '#ff6b6b',
// // //                     color: '#fff',
// // //                 },
// // //             });

// // //             if (!credentials.username && usernameRef.current) {
// // //                 usernameRef.current.focus();
// // //             } else if (!credentials.password && passwordRef.current) {
// // //                 passwordRef.current.focus();
// // //             }
// // //             return;
// // //         }

// // //         setLoading(true);

// // //         try {
// // //             // First check for admin
// // //             if (credentials.username === 'admin' && credentials.password === 'admin123') {
// // //                 // Save remember me preference
// // //                 if (rememberMe) {
// // //                     localStorage.setItem('remembered_username', credentials.username);
// // //                 } else {
// // //                     localStorage.removeItem('remembered_username');
// // //                 }

// // //                 onLogin({
// // //                     id: 1,
// // //                     username: 'admin',
// // //                     full_name: 'Administrator',
// // //                     role: 'admin',
// // //                     email: 'admin@inventory.com',
// // //                     avatar: '👨‍💼'
// // //                 });
// // //                 return;
// // //             }

// // //             // Check in database for other users
// // //             const result = await window.electron.auth.login({
// // //                 username: credentials.username,
// // //                 password: credentials.password
// // //             });

// // //             if (result.success) {
// // //                 // Save remember me preference
// // //                 if (rememberMe) {
// // //                     localStorage.setItem('remembered_username', credentials.username);
// // //                 } else {
// // //                     localStorage.removeItem('remembered_username');
// // //                 }

// // //                 onLogin(result.user);
// // //             } else {
// // //                 toast.error(result.message || 'Invalid username or password', {
// // //                     icon: '🔒',
// // //                     duration: 4000,
// // //                 });

// // //                 // Clear password on failed attempt
// // //                 setCredentials(prev => ({ ...prev, password: '' }));
// // //                 if (passwordRef.current) {
// // //                     passwordRef.current.focus();
// // //                 }
// // //             }
// // //         } catch (error) {
// // //             console.error('Login error:', error);
// // //             toast.error('Unable to connect to the server. Please try again.', {
// // //                 icon: '🌐',
// // //                 duration: 5000,
// // //             });
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleInputChange = (field, value) => {
// // //         setCredentials(prev => ({ ...prev, [field]: value }));
// // //     };

// // //     const handleClearUsername = () => {
// // //         setCredentials(prev => ({ ...prev, username: '' }));
// // //         if (usernameRef.current) {
// // //             usernameRef.current.focus();
// // //         }
// // //     };

// // //     const toggleShowPassword = () => {
// // //         setShowPassword(!showPassword);
// // //     };

// // //     return (
// // //         <div
// // //             className="login-container"
// // //             role="main"
// // //             aria-label="Login Page"
// // //         >
// // //             <div
// // //                 className="login-box"
// // //                 role="form"
// // //                 aria-label="Login Form"
// // //             >
// // //                 {/* Logo/Brand Section */}
// // //                 <div className="login-brand" aria-label="Brand Logo">
// // //                     <div className="brand-icon" aria-hidden="true">
// // //                         📦
// // //                     </div>
// // //                     <h1 className="brand-name">Inventory Pro</h1>
// // //                     <p className="brand-tagline">Smart Inventory Management</p>
// // //                 </div>

// // //                 {/* Welcome Section */}
// // //                 <div className="welcome-section">
// // //                     <p className="welcome-text">Sign in</p>
// // //                 </div>

// // //                 {/* Username Field */}
// // //                 <div className="form-group">
// // //                     <label
// // //                         htmlFor="username"
// // //                         className={`form-label ${focusedField === 'username' ? 'focused' : ''}`}
// // //                     >
// // //                         <span className="label-icon" aria-hidden="true">👤</span>
// // //                         <span>Username</span>
// // //                     </label>
// // //                     <div className="input-wrapper">

// // //                         <input
// // //                             id="username"
// // //                             ref={usernameRef}
// // //                             type="text"
// // //                             value={credentials.username}
// // //                             onChange={(e) => handleInputChange('username', e.target.value)}
// // //                             onFocus={() => setFocusedField('username')}
// // //                             onBlur={() => setFocusedField(null)}
// // //                             placeholder="Enter your username"
// // //                             autoComplete="username"
// // //                             disabled={loading}
// // //                             aria-label="Username"
// // //                             aria-required="true"
// // //                             aria-invalid={!credentials.username && focusedField === 'username'}
// // //                             aria-describedby="username-hint"
// // //                         />
// // //                         {credentials.username && !loading && (
// // //                             <button
// // //                                 type="button"
// // //                                 className="clear-button"
// // //                                 onClick={handleClearUsername}
// // //                                 aria-label="Clear username"
// // //                                 style={{ display: 'flex', justifyContent: 'end' }}
// // //                             >
// // //                                 ✕
// // //                             </button>
// // //                         )}
// // //                     </div>
// // //                     <div id="username-hint" className="field-hint" aria-live="polite">
// // //                         {!credentials.username && focusedField === 'username' &&
// // //                             "Enter your username or email address"}
// // //                     </div>
// // //                 </div>

// // //                 {/* Password Field */}
// // //                 <div className="form-group">
// // //                     <label
// // //                         htmlFor="password"
// // //                         className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}
// // //                     >
// // //                         <span className="label-icon" aria-hidden="true">🔒</span>
// // //                         <span>Password</span>
// // //                     </label>
// // //                     <div className="input-wrapper">

// // //                         <input
// // //                             id="password"
// // //                             ref={passwordRef}
// // //                             type={showPassword ? "text" : "password"}
// // //                             value={credentials.password}
// // //                             onChange={(e) => handleInputChange('password', e.target.value)}
// // //                             onFocus={() => setFocusedField('password')}
// // //                             onBlur={() => setFocusedField(null)}
// // //                             placeholder="Enter your password"
// // //                             autoComplete="current-password"
// // //                             disabled={loading}
// // //                             aria-label="Password"
// // //                             aria-required="true"
// // //                             aria-invalid={!credentials.password && focusedField === 'password'}
// // //                             aria-describedby="password-hint"
// // //                         />
// // //                         <button
// // //                             type="button"
// // //                             // className="toggle-password"

// // //                             onClick={toggleShowPassword}
// // //                             aria-label={showPassword ? "Hide password" : "Show password"}
// // //                             aria-pressed={showPassword}
// // //                             style={{ display: 'flex', justifyContent: 'end', background: 'transparent' }}
// // //                         >
// // //                             {showPassword ? '👁️' : '👁️‍🗨️'}
// // //                         </button>
// // //                     </div>
// // //                     <div id="password-hint" className="field-hint" aria-live="polite">
// // //                         {!credentials.password && focusedField === 'password' &&
// // //                             "Enter your password (min. 6 characters)"}
// // //                     </div>
// // //                 </div>


// // //                 {/* Login Button */}
// // //                 <button
// // //                     className={`login-button ${loading ? 'loading' : ''}`}
// // //                     onClick={handleLogin}
// // //                     disabled={loading}
// // //                     aria-label={loading ? "Logging in, please wait" : "Login to your account"}
// // //                     aria-busy={loading}
// // //                 >
// // //                     {loading ? (
// // //                         <>
// // //                             <span className="spinner" aria-hidden="true"></span>
// // //                             <span>Signing in...</span>
// // //                         </>
// // //                     ) : (
// // //                         <>
// // //                             <span>Sign In</span>
// // //                             <span className="button-icon" aria-hidden="true">→</span>
// // //                         </>
// // //                     )}
// // //                 </button>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export default Login;

// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { toast } from 'react-hot-toast';
// // // import './login.css';

// // // function Login({ onLogin }) {
// // //     const [credentials, setCredentials] = useState({
// // //         username: '',
// // //         password: ''
// // //     });
// // //     const [loading, setLoading] = useState(false);
// // //     const [showPassword, setShowPassword] = useState(false);
// // //     const [focusedField, setFocusedField] = useState(null);
// // //     const [rememberMe, setRememberMe] = useState(false);
// // //     const usernameRef = useRef(null);
// // //     const passwordRef = useRef(null);

// // //     useEffect(() => {
// // //         // Auto-focus username field on mount
// // //         if (usernameRef.current) {
// // //             usernameRef.current.focus();
// // //         }

// // //         // Load remembered username if exists
// // //         const rememberedUsername = localStorage.getItem('remembered_username');
// // //         if (rememberedUsername) {
// // //             setCredentials(prev => ({ ...prev, username: rememberedUsername }));
// // //             setRememberMe(true);
// // //         }
// // //     }, []);

// // //     useEffect(() => {
// // //         const handleKeyPress = (e) => {
// // //             if (e.key === 'Enter' && !loading) {
// // //                 handleLogin();
// // //             }
// // //         };

// // //         window.addEventListener('keypress', handleKeyPress);
// // //         return () => window.removeEventListener('keypress', handleKeyPress);
// // //     }, [credentials, loading]);

// // //     const handleLogin = async () => {
// // //         if (!credentials.username || !credentials.password) {
// // //             toast.error('Please enter both username and password', {
// // //                 icon: '⚠️',
// // //                 style: {
// // //                     background: '#ff6b6b',
// // //                     color: '#fff',
// // //                 },
// // //             });

// // //             if (!credentials.username && usernameRef.current) {
// // //                 usernameRef.current.focus();
// // //             } else if (!credentials.password && passwordRef.current) {
// // //                 passwordRef.current.focus();
// // //             }
// // //             return;
// // //         }

// // //         setLoading(true);

// // //         try {
// // //             // First check for admin
// // //             if (credentials.username === 'admin' && credentials.password === 'admin123') {
// // //                 // Save remember me preference
// // //                 if (rememberMe) {
// // //                     localStorage.setItem('remembered_username', credentials.username);
// // //                 } else {
// // //                     localStorage.removeItem('remembered_username');
// // //                 }

// // //                 onLogin({
// // //                     id: 1,
// // //                     username: 'admin',
// // //                     full_name: 'Administrator',
// // //                     role: 'admin',
// // //                     email: 'admin@inventory.com',
// // //                     avatar: '👨‍💼'
// // //                 });
// // //                 return;
// // //             }

// // //             // Check in database for other users
// // //             const result = await window.electron.auth.login({
// // //                 username: credentials.username,
// // //                 password: credentials.password
// // //             });

// // //             if (result.success) {
// // //                 // Save remember me preference
// // //                 if (rememberMe) {
// // //                     localStorage.setItem('remembered_username', credentials.username);
// // //                 } else {
// // //                     localStorage.removeItem('remembered_username');
// // //                 }

// // //                 onLogin(result.user);
// // //             } else {
// // //                 toast.error(result.message || 'Invalid username or password', {
// // //                     icon: '🔒',
// // //                     duration: 4000,
// // //                 });

// // //                 // Clear password on failed attempt
// // //                 setCredentials(prev => ({ ...prev, password: '' }));
// // //                 if (passwordRef.current) {
// // //                     passwordRef.current.focus();
// // //                 }
// // //             }
// // //         } catch (error) {
// // //             console.error('Login error:', error);
// // //             toast.error('Unable to connect to the server. Please try again.', {
// // //                 icon: '🌐',
// // //                 duration: 5000,
// // //             });
// // //         } finally {
// // //             setLoading(false);
// // //         }
// // //     };

// // //     const handleInputChange = (field, value) => {
// // //         setCredentials(prev => ({ ...prev, [field]: value }));
// // //     };

// // //     const handleClearUsername = () => {
// // //         setCredentials(prev => ({ ...prev, username: '' }));
// // //         if (usernameRef.current) {
// // //             usernameRef.current.focus();
// // //         }
// // //     };

// // //     const toggleShowPassword = () => {
// // //         setShowPassword(!showPassword);
// // //     };

// // //     return (
// // //         <div
// // //             className="login-container"
// // //             role="main"
// // //             aria-label="Login Page"
// // //         >
// // //             <div
// // //                 className="login-box"
// // //                 role="form"
// // //                 aria-label="Login Form"
// // //             >
// // //                 {/* Logo/Brand Section */}
// // //                 <div className="login-brand" aria-label="Brand Logo">
// // //                     <div className="brand-icon" aria-hidden="true">
// // //                         <div className="brand-icon-inner"></div>
// // //                     </div>
// // //                     <h1 className="brand-name">Billing Pro</h1>                </div>


// // //                 {/* Username Field */}
// // //                 <div className="form-group">
// // //                     <label
// // //                         htmlFor="username"
// // //                         className={`form-label ${focusedField === 'username' ? 'focused' : ''}`}
// // //                     >
// // //                         <span className="label-icon" aria-hidden="true">👤</span>
// // //                         <span>Username</span>
// // //                     </label>
// // //                     <div className="input-wrapper">
// // //                         <input
// // //                             id="username"
// // //                             ref={usernameRef}
// // //                             type="text"
// // //                             value={credentials.username}
// // //                             onChange={(e) => handleInputChange('username', e.target.value)}
// // //                             onFocus={() => setFocusedField('username')}
// // //                             onBlur={() => setFocusedField(null)}
// // //                             placeholder="Enter your username"
// // //                             autoComplete="username"
// // //                             disabled={loading}
// // //                             aria-label="Username"
// // //                             aria-required="true"
// // //                             aria-invalid={!credentials.username && focusedField === 'username'}
// // //                             aria-describedby="username-hint"
// // //                         />
// // //                         {credentials.username && !loading && (
// // //                             <button
// // //                                 type="button"
// // //                                 className="clear-button"
// // //                                 onClick={handleClearUsername}
// // //                                 style={{ display: 'flex', alignContent: 'center', justifyContent: 'end', background: 'transparent', position: 'absolute', top: '-60', width: '32px', height: '32px', padding: '0', border: 'none', cursor: 'pointer', margin: '0' }}

// // //                                 aria-label="Clear username"
// // //                             >
// // //                                 ✕

// // //                             </button>
// // //                         )}
// // //                     </div>
// // //                     <div id="username-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
// // //                         {!credentials.username && focusedField === 'username' &&
// // //                             "Enter your username or email address"}
// // //                     </div>
// // //                 </div>

// // //                 {/* Password Field */}
// // //                 <div className="form-group">
// // //                     <label
// // //                         htmlFor="password"
// // //                         className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}
// // //                     >
// // //                         <span className="label-icon" aria-hidden="true">🔒</span>
// // //                         <span>Password</span>
// // //                     </label>
// // //                     <div className="input-wrapper" style={{ position: 'relative' }}>
// // //                         <input
// // //                             id="password"
// // //                             ref={passwordRef}
// // //                             type={showPassword ? "text" : "password"}
// // //                             value={credentials.password}
// // //                             onChange={(e) => handleInputChange('password', e.target.value)}
// // //                             onFocus={() => setFocusedField('password')}
// // //                             onBlur={() => setFocusedField(null)}
// // //                             placeholder="Enter your password"
// // //                             autoComplete="current-password"
// // //                             disabled={loading}
// // //                             aria-label="Password"
// // //                             aria-required="true"
// // //                             aria-invalid={!credentials.password && focusedField === 'password'}
// // //                             aria-describedby="password-hint"
// // //                         />
// // //                         <button
// // //                             type="button"
// // //                             className="toggle-password"
// // //                             style={{ display: 'flex', alignContent: 'center', justifyContent: 'end', background: 'transparent', position: 'absolute', top: '-30', width: '32px', height: '32px', padding: '0', border: 'none', cursor: 'pointer', margin: '0' }}
// // //                             onClick={toggleShowPassword}
// // //                             aria-label={showPassword ? "Hide password" : "Show password"}
// // //                             aria-pressed={showPassword}
// // //                         >
// // //                             {showPassword ? '👁️' : '👁️‍🗨️'}
// // //                         </button>
// // //                     </div>
// // //                     <div id="password-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
// // //                         {!credentials.password && focusedField === 'password' &&
// // //                             "Enter your password (min. 6 characters)"}
// // //                     </div>
// // //                 </div>

// // //                 {/* Login Button */}
// // //                 <button
// // //                     className={`login-button ${loading ? 'loading' : ''}`}
// // //                     onClick={handleLogin}
// // //                     disabled={loading}
// // //                     aria-label={loading ? "Logging in, please wait" : "Login to your account"}
// // //                     aria-busy={loading}
// // //                 >
// // //                     {loading ? (
// // //                         <>
// // //                             <span className="spinner" aria-hidden="true"></span>
// // //                             <span>Signing in...</span>
// // //                         </>
// // //                     ) : (
// // //                         <>
// // //                             <span>Sign In</span>
// // //                             <span className="button-icon" aria-hidden="true">→</span>
// // //                         </>
// // //                     )}
// // //                 </button>
// // //             </div>
// // //         </div>
// // //     );
// // // }

// // // export default Login;

// // import React, { useState, useEffect, useRef } from 'react';
// // import { toast } from 'react-hot-toast';
// // import './login.css';
// // import { PageSizes } from 'pdf-lib';

// // function Login({ onLogin }) {
// //     const [credentials, setCredentials] = useState({
// //         username: '',
// //         password: ''
// //     });
// //     const [loading, setLoading] = useState(false);
// //     const [showPassword, setShowPassword] = useState(false);
// //     const [focusedField, setFocusedField] = useState(null);
// //     const [rememberMe, setRememberMe] = useState(false);
// //     const usernameRef = useRef(null);
// //     const passwordRef = useRef(null);

// //     useEffect(() => {
// //         // Auto-focus username field on mount
// //         if (usernameRef.current) {
// //             usernameRef.current.focus();
// //         }

// //         // Load remembered username if exists
// //         const rememberedUsername = localStorage.getItem('remembered_username');
// //         if (rememberedUsername) {
// //             setCredentials(prev => ({ ...prev, username: rememberedUsername }));
// //             setRememberMe(true);
// //         }
// //     }, []);

// //     useEffect(() => {
// //         const handleKeyPress = (e) => {
// //             if (e.key === 'Enter' && !loading) {
// //                 handleLogin();
// //             }
// //         };

// //         window.addEventListener('keypress', handleKeyPress);
// //         return () => window.removeEventListener('keypress', handleKeyPress);
// //     }, [credentials, loading]);

// //     const handleLogin = async () => {
// //         if (!credentials.username || !credentials.password) {
// //             toast.error('Please enter both username and password', {
// //                 icon: '⚠️',
// //                 style: {
// //                     background: '#ff6b6b',
// //                     color: '#fff',
// //                 },
// //             });

// //             if (!credentials.username && usernameRef.current) {
// //                 usernameRef.current.focus();
// //             } else if (!credentials.password && passwordRef.current) {
// //                 passwordRef.current.focus();
// //             }
// //             return;
// //         }

// //         setLoading(true);

// //         try {
// //             // First check for admin
// //             if (credentials.username === 'admin' && credentials.password === 'admin123') {
// //                 // Save remember me preference
// //                 if (rememberMe) {
// //                     localStorage.setItem('remembered_username', credentials.username);
// //                 } else {
// //                     localStorage.removeItem('remembered_username');
// //                 }

// //                 onLogin({
// //                     id: 1,
// //                     username: 'admin',
// //                     full_name: 'Administrator',
// //                     role: 'admin',
// //                     email: 'admin@inventory.com',
// //                     avatar: '👨‍💼'
// //                 });
// //                 return;
// //             }

// //             // Check in database for other users
// //             const result = await window.electron.auth.login({
// //                 username: credentials.username,
// //                 password: credentials.password
// //             });

// //             if (result.success) {
// //                 // Save remember me preference
// //                 if (rememberMe) {
// //                     localStorage.setItem('remembered_username', credentials.username);
// //                 } else {
// //                     localStorage.removeItem('remembered_username');
// //                 }

// //                 onLogin(result.user);
// //             } else {
// //                 toast.error(result.message || 'Invalid username or password', {
// //                     icon: '🔒',
// //                     duration: 4000,
// //                 });

// //                 // Clear password on failed attempt
// //                 setCredentials(prev => ({ ...prev, password: '' }));
// //                 if (passwordRef.current) {
// //                     passwordRef.current.focus();
// //                 }
// //             }
// //         } catch (error) {
// //             console.error('Login error:', error);
// //             toast.error('Unable to connect to the server. Please try again.', {
// //                 icon: '🌐',
// //                 duration: 5000,
// //             });
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const handleInputChange = (field, value) => {
// //         setCredentials(prev => ({ ...prev, [field]: value }));
// //     };

// //     const handleClearUsername = () => {
// //         setCredentials(prev => ({ ...prev, username: '' }));
// //         if (usernameRef.current) {
// //             usernameRef.current.focus();
// //         }
// //     };

// //     const toggleShowPassword = () => {
// //         setShowPassword(!showPassword);
// //     };

// //     return (
// //         <div
// //             className="login-container"
// //             role="main"
// //             aria-label="Login Page"
// //         >
// //             <div
// //                 className="login-box"
// //                 role="form"
// //                 aria-label="Login Form"
// //             >
// //                 {/* Logo/Brand Section */}
// //                 <div className="login-brand" aria-label="Brand Logo">
// //                     <div className="brand-icon" aria-hidden="true">
// //                         <div className="brand-icon-inner"></div>
// //                     </div>
// //                     <h1 className="brand-name">Billing Pro</h1>
// //                 </div>


// //                 {/* Username Field */}
// //                 <div className="form-group">
// //                     <label
// //                         htmlFor="username"
// //                         className={`form-label ${focusedField === 'username' ? 'focused' : ''}`}
// //                     >
// //                         <span className="label-icon" aria-hidden="true">👤</span>
// //                         <span>Username</span>
// //                     </label>
// //                     <div className="input-wrapper">
// //                         <input
// //                             id="username"
// //                             ref={usernameRef}
// //                             type="text"
// //                             value={credentials.username}
// //                             onChange={(e) => handleInputChange('username', e.target.value)}
// //                             onFocus={() => setFocusedField('username')}
// //                             onBlur={() => setFocusedField(null)}
// //                             placeholder="Enter your username"
// //                             autoComplete="username"
// //                             disabled={loading}
// //                             aria-label="Username"
// //                             aria-required="true"
// //                             aria-invalid={!credentials.username && focusedField === 'username'}
// //                             aria-describedby="username-hint"
// //                         />
// //                         {credentials.username && !loading && (
// //                             <button
// //                                 type="button"
// //                                 className="clear-button"
// //                                 onClick={handleClearUsername}
// //                                 style={{ display: 'flex', alignContent: 'center', justifyContent: 'end', background: 'transparent', position: 'absolute', top: '-60', width: '32px', height: '32px', padding: '0', border: 'none', cursor: 'pointer', margin: '0' }}

// //                                 aria-label="Clear username"
// //                             >
// //                                 ✕

// //                             </button>
// //                         )}
// //                     </div>
// //                     <div id="username-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
// //                         {!credentials.username && focusedField === 'username' &&
// //                             "Enter your username or email address"}
// //                     </div>
// //                 </div>

// //                 {/* Password Field */}
// //                 <div className="form-group">
// //                     <label
// //                         htmlFor="password"
// //                         className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}
// //                     >
// //                         <span className="label-icon" aria-hidden="true">🔒</span>
// //                         <span>Password</span>
// //                     </label>
// //                     <div className="input-wrapper" style={{ position: 'relative' }}>
// //                         <input
// //                             id="password"
// //                             ref={passwordRef}
// //                             type={showPassword ? "text" : "password"}
// //                             value={credentials.password}
// //                             onChange={(e) => handleInputChange('password', e.target.value)}
// //                             onFocus={() => setFocusedField('password')}
// //                             onBlur={() => setFocusedField(null)}
// //                             placeholder="Enter your password"
// //                             autoComplete="current-password"
// //                             disabled={loading}
// //                             aria-label="Password"
// //                             aria-required="true"
// //                             aria-invalid={!credentials.password && focusedField === 'password'}
// //                             aria-describedby="password-hint"
// //                         />
// //                         <button
// //                             type="button"
// //                             className="toggle-password"
// //                             style={{ display: 'flex', alignContent: 'center', justifyContent: 'end', background: 'transparent', position: 'absolute', top: '-30', width: '32px', height: '32px', padding: '0', border: 'none', cursor: 'pointer', margin: '0' }}
// //                             onClick={toggleShowPassword}
// //                             aria-label={showPassword ? "Hide password" : "Show password"}
// //                             aria-pressed={showPassword}
// //                         >
// //                             {showPassword ? '👁️' : '👁️‍🗨️'}
// //                         </button>
// //                     </div>
// //                     <div id="password-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
// //                         {!credentials.password && focusedField === 'password' &&
// //                             "Enter your password (min. 6 characters)"}
// //                     </div>
// //                 </div>

// //                 {/* Login Button */}
// //                 <button
// //                     className={`login-button ${loading ? 'loading' : ''}`}
// //                     onClick={handleLogin}
// //                     disabled={loading}
// //                     aria-label={loading ? "Logging in, please wait" : "Login to your account"}
// //                     aria-busy={loading}
// //                 >
// //                     {loading ? (
// //                         <>
// //                             <span className="spinner" aria-hidden="true"></span>
// //                             <span>Signing in...</span>
// //                         </>
// //                     ) : (
// //                         <>
// //                             <span>Sign In</span>
// //                             <span className="button-icon" aria-hidden="true">→</span>
// //                         </>
// //                     )}
// //                 </button>

// //                 <div className="form-footer" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
// //                     <p style={{ textAlign: 'center', fontSize: '12px' }}>For Support Contact: <a href="tel:+923006468177" style={{ color: 'blue', textDecoration: 'underline' }}>+92 300 6468177</a></p>
// //                     <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>version 1.0.0</p>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // }

// // export default Login;


// // Login.js - Updated version without hardcoded admin
// import React, { useState, useEffect, useRef } from 'react';
// import { toast } from 'react-hot-toast';
// import './login.css';

// function Login({ onLogin }) {
//     const [credentials, setCredentials] = useState({
//         username: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [focusedField, setFocusedField] = useState(null);
//     const [rememberMe, setRememberMe] = useState(false);
//     const usernameRef = useRef(null);
//     const passwordRef = useRef(null);

//     useEffect(() => {
//         // Auto-focus username field on mount
//         if (usernameRef.current) {
//             usernameRef.current.focus();
//         }

//         // Load remembered username if exists
//         const rememberedUsername = localStorage.getItem('remembered_username');
//         if (rememberedUsername) {
//             setCredentials(prev => ({ ...prev, username: rememberedUsername }));
//             setRememberMe(true);
//         }
//     }, []);

//     useEffect(() => {
//         const handleKeyPress = (e) => {
//             if (e.key === 'Enter' && !loading) {
//                 handleLogin();
//             }
//         };

//         window.addEventListener('keypress', handleKeyPress);
//         return () => window.removeEventListener('keypress', handleKeyPress);
//     }, [credentials, loading]);

//     // const handleLogin = async () => {
//     //     if (!credentials.username || !credentials.password) {
//     //         toast.error('Please enter both username and password', {
//     //             icon: '⚠️',
//     //             style: {
//     //                 background: '#ff6b6b',
//     //                 color: '#fff',
//     //             },
//     //         });

//     //         if (!credentials.username && usernameRef.current) {
//     //             usernameRef.current.focus();
//     //         } else if (!credentials.password && passwordRef.current) {
//     //             passwordRef.current.focus();
//     //         }
//     //         return;
//     //     }

//     //     setLoading(true);

//     //     try {
//     //         // REMOVED: Hardcoded admin check
//     //         // Now only check in database for ALL users (including admin)
//     //         const result = await window.electron.auth.login({
//     //             username: credentials.username,
//     //             password: credentials.password
//     //         });

//     //         if (result.success) {
//     //             // Save remember me preference
//     //             if (rememberMe) {
//     //                 localStorage.setItem('remembered_username', credentials.username);
//     //             } else {
//     //                 localStorage.removeItem('remembered_username');
//     //             }

//     //             onLogin(result.user);
//     //             toast.success(`Welcome back, ${result.user.full_name || result.user.username}!`);
//     //         } else {
//     //             toast.error(result.message || 'Invalid username or password', {
//     //                 icon: '🔒',
//     //                 duration: 4000,
//     //             });

//     //             // Clear password on failed attempt
//     //             setCredentials(prev => ({ ...prev, password: '' }));
//     //             if (passwordRef.current) {
//     //                 passwordRef.current.focus();
//     //             }
//     //         }
//     //     } catch (error) {
//     //         console.error('Login error:', error);
//     //         toast.error('Unable to connect to the server. Please try again.', {
//     //             icon: '🌐',
//     //             duration: 5000,
//     //         });
//     //     } finally {
//     //         setLoading(false);
//     //     }
//     // };

    
//     const handleLogin = async () => {
//     if (!credentials.username || !credentials.password) {
//         toast.error('Please enter both username and password', {
//             icon: '⚠️',
//             style: {
//                 background: '#ff6b6b',
//                 color: '#fff',
//             },
//         });

//         if (!credentials.username && usernameRef.current) {
//             usernameRef.current.focus();
//         } else if (!credentials.password && passwordRef.current) {
//             passwordRef.current.focus();
//         }
//         return;
//     }

//     setLoading(true);

//     try {
//         // FIXED: Use the correct API path
//         const result = await window.electron.database.login(
//             credentials.username, 
//             credentials.password
//         );

//         if (result.success) {
//             // Save remember me preference
//             if (rememberMe) {
//                 localStorage.setItem('remembered_username', credentials.username);
//             } else {
//                 localStorage.removeItem('remembered_username');
//             }

//             onLogin(result.user);
//             toast.success(`Welcome back, ${result.user.full_name || result.user.username}!`);
//         } else {
//             toast.error(result.error || 'Invalid username or password', {
//                 icon: '🔒',
//                 duration: 4000,
//             });

//             // Clear password on failed attempt
//             setCredentials(prev => ({ ...prev, password: '' }));
//             if (passwordRef.current) {
//                 passwordRef.current.focus();
//             }
//         }
//     } catch (error) {
//         console.error('Login error:', error);
//         toast.error('Unable to connect to the server. Please try again.', {
//             icon: '🌐',
//             duration: 5000,
//         });
//     } finally {
//         setLoading(false);
//     }
// };
//     const handleInputChange = (field, value) => {
//         setCredentials(prev => ({ ...prev, [field]: value }));
//     };

//     const handleClearUsername = () => {
//         setCredentials(prev => ({ ...prev, username: '' }));
//         if (usernameRef.current) {
//             usernameRef.current.focus();
//         }
//     };

//     const toggleShowPassword = () => {
//         setShowPassword(!showPassword);
//     };

//     return (
//         <div className="login-container" role="main" aria-label="Login Page">
//             <div className="login-box" role="form" aria-label="Login Form">
//                 {/* Logo/Brand Section */}
//                 <div className="login-brand" aria-label="Brand Logo">
//                     <div className="brand-icon" aria-hidden="true">
//                         <div className="brand-icon-inner"></div>
//                     </div>
//                     <h1 className="brand-name">Billing Pro</h1>
//                 </div>

//                 {/* Username Field */}
//                 <div className="form-group">
//                     <label
//                         htmlFor="username"
//                         className={`form-label ${focusedField === 'username' ? 'focused' : ''}`}
//                     >
//                         <span className="label-icon" aria-hidden="true">👤</span>
//                         <span>Username</span>
//                     </label>
//                     <div className="input-wrapper">
//                         <input
//                             id="username"
//                             ref={usernameRef}
//                             type="text"
//                             value={credentials.username}
//                             onChange={(e) => handleInputChange('username', e.target.value)}
//                             onFocus={() => setFocusedField('username')}
//                             onBlur={() => setFocusedField(null)}
//                             placeholder="Enter your username"
//                             autoComplete="username"
//                             disabled={loading}
//                             aria-label="Username"
//                             aria-required="true"
//                             aria-invalid={!credentials.username && focusedField === 'username'}
//                             aria-describedby="username-hint"
//                         />
//                         {credentials.username && !loading && (
//                             <button
//                                 type="button"
//                                 className="clear-button"
//                                 onClick={handleClearUsername}
//                                 style={{
//                                     display: 'flex',
//                                     alignContent: 'center',
//                                     justifyContent: 'end',
//                                     background: 'transparent',
//                                     position: 'absolute',
//                                     top: '-60',
//                                     width: '32px',
//                                     height: '32px',
//                                     padding: '0',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     margin: '0'
//                                 }}
//                                 aria-label="Clear username"
//                             >
//                                 ✕
//                             </button>
//                         )}
//                     </div>
//                     <div id="username-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
//                         {!credentials.username && focusedField === 'username' &&
//                             "Enter your username or email address"}
//                     </div>
//                 </div>

//                 {/* Password Field */}
//                 <div className="form-group">
//                     <label
//                         htmlFor="password"
//                         className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}
//                     >
//                         <span className="label-icon" aria-hidden="true">🔒</span>
//                         <span>Password</span>
//                     </label>
//                     <div className="input-wrapper" style={{ position: 'relative' }}>
//                         <input
//                             id="password"
//                             ref={passwordRef}
//                             type={showPassword ? "text" : "password"}
//                             value={credentials.password}
//                             onChange={(e) => handleInputChange('password', e.target.value)}
//                             onFocus={() => setFocusedField('password')}
//                             onBlur={() => setFocusedField(null)}
//                             placeholder="Enter your password"
//                             autoComplete="current-password"
//                             disabled={loading}
//                             aria-label="Password"
//                             aria-required="true"
//                             aria-invalid={!credentials.password && focusedField === 'password'}
//                             aria-describedby="password-hint"
//                         />
//                         <button
//                             type="button"
//                             className="toggle-password"
//                             style={{
//                                 display: 'flex',
//                                 alignContent: 'center',
//                                 justifyContent: 'end',
//                                 background: 'transparent',
//                                 position: 'absolute',
//                                 top: '-30',
//                                 width: '32px',
//                                 height: '32px',
//                                 padding: '0',
//                                 border: 'none',
//                                 cursor: 'pointer',
//                                 margin: '0'
//                             }}
//                             onClick={toggleShowPassword}
//                             aria-label={showPassword ? "Hide password" : "Show password"}
//                             aria-pressed={showPassword}
//                         >
//                             {showPassword ? '👁️' : '👁️‍🗨️'}
//                         </button>
//                     </div>
//                     <div id="password-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
//                         {!credentials.password && focusedField === 'password' &&
//                             "Enter your password (min. 6 characters)"}
//                     </div>
//                 </div>

//                 {/* Remember Me Checkbox */}
//                 {/* <div className="form-group" style={{ marginTop: '-10px' }}>
//                     <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', gap: '3px', cursor: 'pointer' }}>
//                         <input
//                             type="checkbox"
//                             style={{ width: '15px', height: '15px' }}
//                             checked={rememberMe}
//                             onChange={(e) => setRememberMe(e.target.checked)}
//                             disabled={loading}
//                         />
//                         <span style={{ fontSize: '15px', color: '#666' }}>Remember me</span>
//                     </label>
//                 </div> */}

//                 {/* Login Button */}
//                 <button
//                     className={`login-button ${loading ? 'loading' : ''}`}
//                     onClick={handleLogin}
//                     disabled={loading}
//                     aria-label={loading ? "Logging in, please wait" : "Login to your account"}
//                     aria-busy={loading}
//                 >
//                     {loading ? (
//                         <>
//                             <span className="spinner" aria-hidden="true"></span>
//                             <span>Signing in...</span>
//                         </>
//                     ) : (
//                         <>
//                             <span>Sign In</span>
//                             <span className="button-icon" aria-hidden="true">→</span>
//                         </>
//                     )}
//                 </button>

//                 <div className="form-footer" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
//                     <p style={{ textAlign: 'center', fontSize: '12px' }}>For Support Contact: <a href="tel:+923006468177" style={{ color: 'blue', textDecoration: 'underline' }}>+92 300 6468177</a></p>
//                     <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>version 1.0.0</p>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Login;
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import './login.css';

function Login({ onLogin }) {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [rememberMe, setRememberMe] = useState(false);
    const [backgroundImage, setBackgroundImage] = useState('');
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        // Load random background image
        const imageNames = ['1.jpg', '2.jpg', '3.jpg', '4.jpg'];
        const randomIndex = Math.floor(Math.random() * imageNames.length);
        try {
            // Dynamic require for images
            const imagePath = require(`../assets/${imageNames[randomIndex]}`);
            setBackgroundImage(imagePath);
        } catch (error) {
            console.warn('Image not found');
            setBackgroundImage(null);
        }
        
        // Auto-focus username field on mount
        if (usernameRef.current) {
            usernameRef.current.focus();
        }

        // Load remembered username if exists
        const rememberedUsername = localStorage.getItem('remembered_username');
        if (rememberedUsername) {
            setCredentials(prev => ({ ...prev, username: rememberedUsername }));
            setRememberMe(true);
        }
    }, []);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'Enter' && !loading) {
                handleLogin();
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [credentials, loading]);

    const handleLogin = async () => {
        if (!credentials.username || !credentials.password) {
            toast.error('Please enter both username and password', {
                icon: '⚠️',
                style: {
                    background: '#ff6b6b',
                    color: '#fff',
                },
            });

            if (!credentials.username && usernameRef.current) {
                usernameRef.current.focus();
            } else if (!credentials.password && passwordRef.current) {
                passwordRef.current.focus();
            }
            return;
        }

        setLoading(true);

        try {
            const result = await window.electron.database.login(
                credentials.username, 
                credentials.password
            );

            if (result.success) {
                if (rememberMe) {
                    localStorage.setItem('remembered_username', credentials.username);
                } else {
                    localStorage.removeItem('remembered_username');
                }

                onLogin(result.user);
                toast.success(`Welcome back, ${result.user.full_name || result.user.username}!`);
            } else {
                toast.error(result.error || 'Invalid username or password', {
                    icon: '🔒',
                    duration: 4000,
                });

                setCredentials(prev => ({ ...prev, password: '' }));
                if (passwordRef.current) {
                    passwordRef.current.focus();
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('Unable to connect to the server. Please try again.', {
                icon: '🌐',
                duration: 5000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setCredentials(prev => ({ ...prev, [field]: value }));
    };

    const handleClearUsername = () => {
        setCredentials(prev => ({ ...prev, username: '' }));
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div 
            className="login-container" 
            role="main" 
            aria-label="Login Page"
            style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}}
        >
            <div className="login-box" role="form" aria-label="Login Form">
                {/* Logo/Brand Section */}
                <div className="login-brand" aria-label="Brand Logo">
                    <div className="brand-icon" aria-hidden="true">
                        <div className="brand-icon-inner"></div>
                    </div>
                    <h1 className="brand-name">Billing Pro</h1>
                </div>

                {/* Username Field */}
                <div className="form-group">
                    <label
                        htmlFor="username"
                        className={`form-label ${focusedField === 'username' ? 'focused' : ''}`}
                    >
                        <span className="label-icon" aria-hidden="true">👤</span>
                        <span>Username</span>
                    </label>
                    <div className="input-wrapper">
                        <input
                            id="username"
                            ref={usernameRef}
                            type="text"
                            value={credentials.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter your username"
                            autoComplete="username"
                            disabled={loading}
                            aria-label="Username"
                            aria-required="true"
                            aria-invalid={!credentials.username && focusedField === 'username'}
                            aria-describedby="username-hint"
                        />
                        {credentials.username && !loading && (
                            <button
                                type="button"
                                className="clear-button"
                                onClick={handleClearUsername}
                                style={{
                                    display: 'flex',
                                    alignContent: 'center',
                                    justifyContent: 'end',
                                    background: 'transparent',
                                    position: 'absolute',
                                    top: '-60',
                                    width: '32px',
                                    height: '32px',
                                    padding: '0',
                                    border: 'none',
                                    cursor: 'pointer',
                                    margin: '0'
                                }}
                                aria-label="Clear username"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                    <div id="username-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
                        {!credentials.username && focusedField === 'username' &&
                            "Enter your username or email address"}
                    </div>
                </div>

                {/* Password Field */}
                <div className="form-group">
                    <label
                        htmlFor="password"
                        className={`form-label ${focusedField === 'password' ? 'focused' : ''}`}
                    >
                        <span className="label-icon" aria-hidden="true">🔒</span>
                        <span>Password</span>
                    </label>
                    <div className="input-wrapper" style={{ position: 'relative' }}>
                        <input
                            id="password"
                            ref={passwordRef}
                            type={showPassword ? "text" : "password"}
                            value={credentials.password}
                            onChange={(e) => handleInputChange('password', e.target.value)}
                            onFocus={() => setFocusedField('password')}
                            onBlur={() => setFocusedField(null)}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={loading}
                            aria-label="Password"
                            aria-required="true"
                            aria-invalid={!credentials.password && focusedField === 'password'}
                            aria-describedby="password-hint"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            style={{
                                display: 'flex',
                                alignContent: 'center',
                                justifyContent: 'end',
                                background: 'transparent',
                                position: 'absolute',
                                top: '-30',
                                width: '32px',
                                height: '32px',
                                padding: '0',
                                border: 'none',
                                cursor: 'pointer',
                                margin: '0'
                            }}
                            onClick={toggleShowPassword}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            aria-pressed={showPassword}
                        >
                            {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                    </div>
                    <div id="password-hint" className="field-hint" aria-live="polite" style={{ color: 'red' }}>
                        {!credentials.password && focusedField === 'password' &&
                            "Enter your password (min. 6 characters)"}
                    </div>
                </div>

                {/* Login Button */}
                <button
                    className={`login-button ${loading ? 'loading' : ''}`}
                    onClick={handleLogin}
                    disabled={loading}
                    aria-label={loading ? "Logging in, please wait" : "Login to your account"}
                    aria-busy={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner" aria-hidden="true"></span>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <>
                            <span>Sign In</span>
                            <span className="button-icon" aria-hidden="true">→</span>
                        </>
                    )}
                </button>

                <div className="form-footer" style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column', gap: '5px', marginTop: '5px' }}>
                    <p style={{ textAlign: 'center', fontSize: '12px' }}>For Support Contact: <a href="tel:+923006468177" style={{ color: 'blue', textDecoration: 'underline' }}>+92 300 6468177</a></p>
                    <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold' }}>version 1.0.0</p>
                </div>
            </div>
        </div>
    );
}

export default Login;