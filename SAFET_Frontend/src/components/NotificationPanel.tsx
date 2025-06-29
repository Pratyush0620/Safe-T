// import React from 'react';
// import { Bell, AlertTriangle, X } from 'lucide-react';
// import { Notification } from '../types';
// import './dashbstyle.css'

// interface NotificationPanelProps {
//   notifications: Notification[];
//   onDismiss: (id: string) => void;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function NotificationPanel({ notifications, onDismiss, isOpen, onClose }: NotificationPanelProps) {
//   if (!isOpen) return null;

//   return (
//     <div className="absolute right-8 top-24 w-96 bg-gray-800 rounded-xl shadow-lg overflow-hidden">
//       <div className="p-4 bg-navy-900 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <Bell className="text-blue-400" />
//           <h3 className="text-lg font-semibold">Notifications</h3>
//         </div>
//         <button onClick={onClose} className="text-gray-400 hover:text-white">
//           <X size={20} />
//         </button>
//       </div>
//       <div className="max-h-96 overflow-y-auto">
//         {notifications.length === 0 ? (
//           <p className="p-4 text-gray-400">No notifications</p>
//         ) : (
//           notifications.map((notification) => (
//             <div
//               key={notification.id}
//               className={`p-4 border-b border-navy-900 flex items-start gap-3 ${
//                 notification.type === 'sos' ? 'bg-red-900/20' : ''
//               }`}
//             >
//               {notification.type === 'sos' && (
//                 <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" />
//               )}
//               <div className="flex-1">
//                 <p className="text-white">{notification.message}</p>
//                 <p className="text-sm text-gray-400">
//                   {notification.timestamp.toLocaleTimeString()}
//                 </p>
//               </div>
//               <button
//                 onClick={() => onDismiss(notification.id)}
//                 className="text-gray-400 hover:text-white"
//               >
//                 <X size={16} />
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }



// // @ts-ignore
// import React from 'react';
// import { Bell, AlertTriangle, X, Info } from 'lucide-react';
// import { Notification } from '../types';

// interface NotificationPanelProps {
//     notifications: Notification[];
//     onDismiss: (id: string) => void;
//     isOpen: boolean;
//     onClose: () => void;
// }

// export function NotificationPanel({ notifications, onDismiss, isOpen, onClose }: NotificationPanelProps) {
//     if (!isOpen) return null;

//     return (
//         <div className="absolute right-8 top-24 w-96 bg-blue-800 rounded-xl shadow-lg overflow-hidden">
//             <div className="p-4 bg-navy-900 flex justify-between items-center">
//                 <div className="flex items-center gap-2">
//                     <Bell className="text-blue-400" />
//                     <h3 className="text-lg font-semibold">Notifications</h3>
//                 </div>
//                 <button onClick={onClose} className="text-gray-400 hover:text-white">
//                     <X size={20} />
//                 </button>
//             </div>
//             <div className="max-h-96 overflow-y-auto">
//                 {notifications.length === 0 ? (
//                     <p className="p-4 text-gray-400">No notifications</p>
//                 ) : (
//                     notifications.map((notification) => (
//                         <div
//                             key={notification.id}
//                             className={`p-4 border-b border-navy-900 flex items-start gap-3 ${
//                                 notification.type === 'sos' ? 'bg-red-700' :
//                                     notification.type === 'warning' ? 'bg-yellow-600' :
//                                         'bg-blue-900/20'
//                             }`}
//                         >
//                             {/* MODIFIED: Added different icons based on notification type */}
//                             {notification.type === 'sos' && (
//                                 <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" />
//                             )}
//                             {notification.type === 'warning' && (
//                                 <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
//                             )}
//                             {notification.type === 'info' && (
//                                 <Info className="text-blue-400 mt-1 flex-shrink-0" />
//                             )}
//                             <div className="flex-1">
//                                 <p className="text-white">{notification.message}</p>
//                                 <p className="text-sm text-white-400">
//                                     {notification.timestamp.toLocaleTimeString()}
//                                 </p>
//                             </div>
//                             <button
//                                 onClick={() => onDismiss(notification.id)}
//                                 className="text-gray-400 hover:text-white"
//                             >
//                                 <X size={16} />
//                             </button>
//                         </div>
//                     ))
//                 )}
//             </div>
//         </div>
//     );
// }


import React, { useEffect } from 'react';
import { Bell, AlertTriangle, X, Info } from 'lucide-react';
import { Notification } from '../types';

interface NotificationPanelProps {
    notifications: Notification[];
    onDismiss: (id: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onFilteredCountChange?: (count: number) => void; // New prop to report filtered count
}

export function NotificationPanel({ 
    notifications, 
    onDismiss, 
    isOpen, 
    onClose,
    onFilteredCountChange 
}: NotificationPanelProps) {
    // Filter out duplicate notifications for types 'sos' and 'warning'
    const filteredNotifications = notifications.reduce((acc, curr) => {
        if (curr.type === 'sos' || curr.type === 'warning') {
            // only add if no identical notification already exists
            if (!acc.find(n => n.type === curr.type && n.message === curr.message)) {
                acc.push(curr);
            }
        } else {
            acc.push(curr);
        }
        return acc;
    }, [] as Notification[]);

    // Report the filtered count to parent component whenever it changes
    useEffect(() => {
        if (onFilteredCountChange) {
            onFilteredCountChange(filteredNotifications.length);
        }
    }, [filteredNotifications.length, onFilteredCountChange]);

    if (!isOpen) return null;

    return (
        <div className="absolute right-8 top-24 w-96 bg-blue-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 bg-navy-900 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Bell className="text-blue-400" />
                    <h3 className="text-lg font-semibold">Notifications</h3>
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X size={20} />
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {filteredNotifications.length === 0 ? (
                    <p className="p-4 text-gray-400">No notifications</p>
                ) : (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 border-b border-navy-900 flex items-start gap-3 ${
                                notification.type === 'sos'
                                    ? 'bg-red-700'
                                    : notification.type === 'warning'
                                    ? 'bg-yellow-600'
                                    : 'bg-blue-900/20'
                            }`}
                        >
                            {notification.type === 'sos' && (
                                <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" />
                            )}
                            {notification.type === 'warning' && (
                                <AlertTriangle className="text-yellow-400 mt-1 flex-shrink-0" />
                            )}
                            {notification.type === 'info' && (
                                <Info className="text-blue-400 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <p className="text-white">{notification.message}</p>
                                <p className="text-sm text-white-400">
                                    {notification.timestamp.toLocaleTimeString()}
                                </p>
                            </div>
                            <button
                                onClick={() => onDismiss(notification.id)}
                                className="text-gray-400 hover:text-white"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}