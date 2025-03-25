import { axiosInstance } from "@/api/global-config";
import { useUserQuery } from "@/api/queries/auth";
import { routes } from "@/constants/routes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SelectWorkspacePage = () => {
  const { data } = useUserQuery();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const ownedOrganizations = data?.user?.ownedOrganizations || [];
  const memberOrganizations = data?.user?.memberOrganizations || [];
  const hasOrganizations = ownedOrganizations.length > 0 || memberOrganizations.length > 0;

  const handleSelectOrganization = async (organizationId: string) => {
    try {
      setIsLoading(true);
      // Здесь будет запрос на API для установки активной организации
      await axiosInstance.post('/api/users/set-active-organization', { organizationId });
      toast.success('Организация выбрана');
      navigate(routes.shiftView);
    } catch (error) {
      toast.error('Ошибка при выборе организации');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrganization = async (name: string) => {
    try {
      setIsLoading(true);
      // Здесь будет запрос на API для создания новой организации
      const response = await axiosInstance.post('/api/organizations', { name });
      const organizationId = response.data.id;
      toast.success('Организация создана');

      // Устанавливаем созданную организацию как активную
      await handleSelectOrganization(organizationId);
    } catch (error) {
      toast.error('Ошибка при создании организации');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Выберите организацию</h1>

      {isLoading ? (
        <div>Загрузка...</div>
      ) : (
        <>
          {hasOrganizations ? (
            <div className="space-y-6">
              {ownedOrganizations.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ваши организации</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ownedOrganizations.map((org: any) => (
                      <div
                        key={org.id}
                        className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectOrganization(org.id)}
                      >
                        <h3 className="font-medium">{org.name}</h3>
                        <p className="text-sm text-gray-500">Владелец</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {memberOrganizations.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Организации, в которых вы участвуете</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {memberOrganizations.map((org: any) => (
                      <div
                        key={org.id}
                        className="border p-4 rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleSelectOrganization(org.id)}
                      >
                        <h3 className="font-medium">{org.name}</h3>
                        <p className="text-sm text-gray-500">Участник</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="mb-4">У вас пока нет организаций</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={() => {
                  const name = prompt('Введите название организации');
                  if (name) handleCreateOrganization(name);
                }}
              >
                Создать организацию
              </button>
            </div>
          )}

          {hasOrganizations && (
            <div className="mt-8 text-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => {
                  const name = prompt('Введите название организации');
                  if (name) handleCreateOrganization(name);
                }}
              >
                Создать новую организацию
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}; 