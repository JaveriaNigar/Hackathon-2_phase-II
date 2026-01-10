// frontend/src/components/dashboard/UserInfoCards.tsx
import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserInfoCardsProps {
  user: User | null;
  taskCount: number;
  pendingTaskCount: number;
  completedTaskCount: number;
}

const UserInfoCards: React.FC<UserInfoCardsProps> = ({ user, taskCount, pendingTaskCount, completedTaskCount }) => {
  return (
    <div className="w-full flex">
      {/* Inner row - right aligned */}
      <div className="flex flex-col md:flex-row gap-4 ml-auto"> {/* Reduced gap from 6 to 4 */}
        {/* Name Box */}
        <div className="w-[240px] h-[100px] flex flex-col items-center justify-center
                        bg-brown-light border border-brown-accent rounded-xl shadow-sm
                        hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-black mb-1">Name</h3>
          <p className="text-sm font-medium text-brown-accent">{user?.name || 'User'}</p>
        </div>

        {/* Email Box */}
        <div className="w-[240px] h-[100px] flex flex-col items-center justify-center
                        bg-brown-light border border-brown-accent rounded-xl shadow-sm
                        hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-black mb-1">Email</h3>
          <p className="text-sm font-medium text-brown-accent">{user?.email || 'user@example.com'}</p>
        </div>

        {/* Total Tasks Box */}
        <div className="w-[240px] h-[100px] flex flex-col items-center justify-center
                        bg-brown-light border border-brown-accent rounded-xl shadow-sm
                        hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-black mb-1">Total Tasks</h3>
          <p className="text-sm font-medium text-brown-accent">{taskCount}</p>
        </div>

        {/* Pending Tasks Box */}
        <div className="w-[240px] h-[100px] flex flex-col items-center justify-center
                        bg-brown-light border border-brown-accent rounded-xl shadow-sm
                        hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-black mb-1">Pending Tasks</h3>
          <p className="text-sm font-medium text-brown-accent">{pendingTaskCount}</p>
        </div>

        {/* Completed Tasks Box */}
        <div className="w-[240px] h-[100px] flex flex-col items-center justify-center
                        bg-brown-light border border-brown-accent rounded-xl shadow-sm
                        hover:shadow-lg transition-shadow duration-300">
          <h3 className="text-sm font-semibold text-black mb-1">Completed Tasks</h3>
          <p className="text-sm font-medium text-brown-accent">{completedTaskCount}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCards;
