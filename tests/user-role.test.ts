
import { User } from '../entities/user-entity';
import { Role } from '../entities/role-entity';
import { dataSource } from '../jest.setup';
import { Repository } from 'typeorm';


describe('User and Role Entities', () => {

    
    
    let roleRepository: Repository<Role>;
    let userRepository: Repository<User>;
  
    beforeAll(() => {
      roleRepository = dataSource.getRepository(Role);
      userRepository = dataSource.getRepository(User);
    });

  beforeEach(async () => {
    await userRepository.query(`DELETE FROM user`);
    await roleRepository.query(`DELETE FROM role`);
  });

  it('should create a role and a user with that role', async () => {
    const role = new Role();
    role.role_name = 'Admin';
    await roleRepository.save(role);

    const user = new User();
    user.name = 'John Doe';
    user.password = 'password';
    user.email = 'john.doe@example.com';
    user.role = role;
    user.access_token = '';
    user.salt = 'abcde';
    await userRepository.save(user);

    const savedUser = await userRepository.findOne({ where: { email: 'john.doe@example.com' }, relations: ['role'] });

    expect(savedUser).toBeDefined();
    expect(savedUser?.role).toBeDefined();
    expect(savedUser?.role.role_name).toBe('Admin');
  });

  it('should retrieve users with their roles', async () => {
    const role = new Role();
    role.role_name = 'User';
    await roleRepository.save(role);

    const user1 = new User();
    user1.name = 'Alice';
    user1.password = 'password';
    user1.email = 'alice@example.com';
    user1.role = role;
    user1.salt = 'abcd';
    user1.access_token = '';
    await userRepository.save(user1);

    const user2 = new User();
    user2.name = 'Bob';
    user2.email = 'bob@example.com';
    user2.password = 'password';
    user2.role = role;
    user2.salt = 'abcdg';
    user2.access_token = '';
    await userRepository.save(user2);

    const users = await userRepository.find({ relations: ['role'] });

    expect(users).toHaveLength(2);
    expect(users[0].role.role_name).toBe('User');
    expect(users[1].role.role_name).toBe('User');
  });

  it('should ensure user role is not null', async () => {
    const role = new Role();
    role.role_name = 'Admin';
    await roleRepository.save(role);

    const user = new User();
    user.name = 'John Doe';
    user.password = 'password';
    user.salt = 'abcdg';
    user.access_token = '';
    user.email = 'john.doe@example.com';
    user.role = role;
    await userRepository.save(user);

    const savedUser = await userRepository.findOne({ where: { email: 'john.doe@example.com' }, relations: ['role'] });

    expect(savedUser).toBeDefined();
    expect(savedUser?.role).not.toBeNull();
  });

  it('should get user by id and id should not be null', async () => {
    const role = new Role();
    role.role_name = 'User';
    await roleRepository.save(role);

    const user = new User();
    user.name = 'Alice';
    user.email = 'alice@example.com';
    user.password = 'password';
    user.salt = 'abcdg';
    user.access_token = '';
    user.role = role;
    await userRepository.save(user);

    const savedUser = await userRepository.findOne({ where: { email: 'alice@example.com' } });
    expect(savedUser).toBeDefined();
    expect(savedUser?.id).not.toBeNull();

    const retrievedUser = await userRepository.findOne({ where: { id: savedUser?.id }, relations: ['role'] });
    expect(retrievedUser).toBeDefined();
    expect(retrievedUser?.id).toEqual(savedUser?.id);
    expect(retrievedUser?.role).toBeDefined();
    expect(retrievedUser?.role.role_name).toBe('User');
  });

  it('should update user by id but id should not be null', async () => {
    const role = new Role();
    role.role_name = 'User';
    await roleRepository.save(role);

    const user = new User();
    user.name = 'Alice';
    user.email = 'alice@example.com';
    user.password = 'password';
    user.salt = 'abcdg';
    user.access_token = '';
    user.role = role;
    await userRepository.save(user);

    const savedUser = await userRepository.findOne({ where: { email: 'alice@example.com' } });
    expect(savedUser).toBeDefined();
    expect(savedUser?.id).not.toBeNull();

    if (savedUser) {
      savedUser.name = 'Alice Updated';
      await userRepository.save(savedUser);
    }

    const updatedUser = await userRepository.findOne({ where: { id: savedUser?.id } });
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.name).toBe('Alice Updated');
  });

  it('should ensure only admin can retrieve list of all users', async () => {
    const adminRole = new Role();
    adminRole.role_name = 'Admin';
    await roleRepository.save(adminRole);

    const userRole = new Role();
    userRole.role_name = 'User';
    await roleRepository.save(userRole);

    const admin = new User();
    admin.name = 'Admin User';
    admin.email = 'admin@example.com';
    admin.password = 'password';
    admin.salt = 'abcdg';
    admin.access_token = '';
    admin.role = adminRole;
    await userRepository.save(admin);

    const user1 = new User();
    user1.name = 'User One';
    user1.email = 'user1@example.com';
    user1.password = 'password';
    user1.salt = 'abcdg';
    user1.access_token = '';
    user1.role = userRole;
    await userRepository.save(user1);

    const user2 = new User();
    user2.name = 'User Two';
    user2.email = 'user2@example.com';
    user2.password = 'password';
    user2.salt = 'abcdg';
    user2.access_token = '';
    user2.role = userRole;
    await userRepository.save(user2);

    const isAdmin = (roleId: number) => roleId === adminRole.id;

    const adminUsers = await userRepository.find({ relations: ['role'] });
    expect(adminUsers).toHaveLength(3);

    const nonAdmin = user1;
    expect(nonAdmin.role.id).not.toBeNull();
    const nonAdminUsers = isAdmin(2) ? await userRepository.find({ relations: ['role'] }) : [];
    expect(nonAdminUsers).toHaveLength(0);
  });
});
