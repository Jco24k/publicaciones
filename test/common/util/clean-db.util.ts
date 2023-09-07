import { PassportCrypt } from 'src/common/util/passport-crypt';
import { Post } from 'src/modules/posts/entities/post.entity';
import { RolesValid } from 'src/modules/role/entities/enum/roles-valid.enum';
import { Role } from 'src/modules/role/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource, In } from 'typeorm';

export const CleanDB = async (dbConnection: DataSource) => {
  await dbConnection.createQueryBuilder().delete().from(Post).execute();
  await dbConnection.createQueryBuilder().delete().from(User).execute();
  // await dbConnection.createQueryBuilder().delete().from(Role).execute();
  return await createFirstUserAdmin(dbConnection);
};

const createFirstUserAdmin = async (dataSource: DataSource) => {
  try {
    // Obtener el DataSource resolviendo la promesa

    // Obtener los repositorios para Role y User utilizando DataSource
    const roleRepository = dataSource.getRepository(Role);
    const userRepository = dataSource.getRepository(User);

    const adminUser = process.env.USER_ADMIN;
    const adminPass = process.env.PASS_ADMIN;

    // Verificar si los roles ya están registrados en la base de datos
    const rolesValid = Object.values(RolesValid);
    const existingRoles = await roleRepository.find({
      where: {
        name: In(rolesValid),
      },
    });

    // Registrar los roles que aún no existen en la base de datos
    if (existingRoles.length !== rolesValid.length) {
      const rolesToRegister = rolesValid.filter(
        (role) =>
          !existingRoles.some((existingRole) => existingRole.name === role),
      );
      const rolesCreatePromises = rolesToRegister.map((role) => {
        return roleRepository.save({
          name: role,
        });
      });
      await Promise.all(rolesCreatePromises);
    }

    // Obtener todos los roles de la base de datos
    const roles = await roleRepository.find();

    // Verificar si el usuario administrador ya existe
    const existingAdminUser = await userRepository.findOne({
      where: { username: adminUser },
    });

    // Si el usuario administrador no existe, crearlo
    if (!existingAdminUser) {
      await userRepository.save({
        email: adminUser,
        username: adminUser,
        password: PassportCrypt.encrypt(adminPass), // Asegúrate de que esto esté correctamente implementado
        roles,
      });
    }
    return roles[0]
  } catch (error) {
    console.error('Error creating the first admin user:', error);
  }
};
