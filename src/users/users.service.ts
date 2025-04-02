import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSignUpDto } from './dto/user-signup.dto';
import { hash,compare } from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign } from 'jsonwebtoken';
import { StringValue } from 'ms';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async signup(userSignUpDto:UserSignUpDto): Promise<UserEntity>{ 
    const userExists = await this.findUserByEmail(userSignUpDto.email);
    if(userExists)
      throw new BadRequestException('Email already existed.')

    userSignUpDto.password = await hash(userSignUpDto.password,10);
    
    let user = this.usersRepository.create(userSignUpDto);
    user = await this.usersRepository.save(user);
    delete user.password;
    return user;
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity>{
    const {email, password} = userSignInDto;
    const userExists = await this.usersRepository
      .createQueryBuilder('users')
      .addSelect('users.password')
      .where('users.email=:email',{email})
      .getOne();

    if(!userExists)
      throw new BadRequestException('Bad credentials.');

    const matchPassword = await compare(password,userExists.password);

    if(!matchPassword)
      throw new BadRequestException('Bad credentials.');

    delete userExists.password;

    return userExists;
  }

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return await this.usersRepository.findOneBy({email});
  }

  async accessToken(user: UserEntity): Promise<string> {
    const expiresIn =  process.env.ACCESS_TOKEN_EXPIRE_TIME as StringValue;
    return sign(
      {id:user.id,email:user.email},
      process.env.ACCESS_TOKEN_SECRET_KEY,
      {expiresIn});
  }
}
