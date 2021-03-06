USE [master]
GO
/****** Object:  Database [FUCKHEAD]    Script Date: 10/24/2020 12:46:45 AM ******/
CREATE DATABASE [FUCKHEAD]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FUCKHEAD', FILENAME = N'D:\rdsdbdata\DATA\FUCKHEAD.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'FUCKHEAD_log', FILENAME = N'D:\rdsdbdata\DATA\FUCKHEAD_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [FUCKHEAD] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FUCKHEAD].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FUCKHEAD] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FUCKHEAD] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FUCKHEAD] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FUCKHEAD] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FUCKHEAD] SET ARITHABORT OFF 
GO
ALTER DATABASE [FUCKHEAD] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FUCKHEAD] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FUCKHEAD] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FUCKHEAD] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FUCKHEAD] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FUCKHEAD] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FUCKHEAD] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FUCKHEAD] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FUCKHEAD] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FUCKHEAD] SET  ENABLE_BROKER 
GO
ALTER DATABASE [FUCKHEAD] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FUCKHEAD] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FUCKHEAD] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FUCKHEAD] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FUCKHEAD] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FUCKHEAD] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FUCKHEAD] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FUCKHEAD] SET RECOVERY FULL 
GO
ALTER DATABASE [FUCKHEAD] SET  MULTI_USER 
GO
ALTER DATABASE [FUCKHEAD] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FUCKHEAD] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FUCKHEAD] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FUCKHEAD] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [FUCKHEAD] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [FUCKHEAD] SET QUERY_STORE = OFF
GO
USE [FUCKHEAD]
GO
/****** Object:  User [admin]    Script Date: 10/24/2020 12:46:46 AM ******/
CREATE USER [admin] FOR LOGIN [admin] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [admin]
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequence]    Script Date: 10/24/2020 12:46:46 AM ******/
CREATE SEQUENCE [dbo].[MySequence] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequence1]    Script Date: 10/24/2020 12:46:46 AM ******/
CREATE SEQUENCE [dbo].[MySequence1] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequence2]    Script Date: 10/24/2020 12:46:46 AM ******/
CREATE SEQUENCE [dbo].[MySequence2] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequence5]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequence5] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequence6]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequence6] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequenceFacemash_clone]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequenceFacemash_clone] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequencefacemash_clone_2]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequencefacemash_clone_2] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequencefacemash_clone_3]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequencefacemash_clone_3] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequenceFacemash_clone3]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequenceFacemash_clone3] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
USE [FUCKHEAD]
GO
/****** Object:  Sequence [dbo].[MySequenceFacemash_test]    Script Date: 10/24/2020 12:46:47 AM ******/
CREATE SEQUENCE [dbo].[MySequenceFacemash_test] 
 AS [bigint]
 START WITH 1
 INCREMENT BY 1
 MINVALUE -9223372036854775808
 MAXVALUE 9223372036854775807
 NO CACHE 
GO
/****** Object:  Table [dbo].[facemash_clone_3]    Script Date: 10/24/2020 12:46:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[facemash_clone_3](
	[id] [bigint] NOT NULL,
	[name] [nvarchar](64) NOT NULL,
	[score] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[facemash_clone]    Script Date: 10/24/2020 12:46:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[facemash_clone](
	[id] [bigint] NOT NULL,
	[name] [nvarchar](64) NOT NULL,
	[score] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[facemash_clone_2]    Script Date: 10/24/2020 12:46:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[facemash_clone_2](
	[id] [bigint] NOT NULL,
	[name] [nvarchar](64) NOT NULL,
	[score] [bigint] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[identityTable]    Script Date: 10/24/2020 12:46:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[identityTable](
	[idCol] [int] IDENTITY(1,1) NOT NULL,
	[nameCol] [varchar](255) NOT NULL,
	[textCol] [varchar](255) NULL,
	[numberCol] [int] NULL,
	[GUID] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[idCol] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[sequenceTable]    Script Date: 10/24/2020 12:46:47 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[sequenceTable](
	[ID] [bigint] NOT NULL,
	[Title] [nvarchar](64) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (1, N'0406172109b.jpg', 1436)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (2, N'0718171732a_HDR.jpg', 179)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (3, N'0822171658_HDR.jpg', 1472)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (4, N'0830171721_HDR.jpg', 135)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (5, N'1106172345a_HDR.jpg', 1448)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (6, N'1116170509c_HDR.jpg', 1343)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (7, N'0830171723_HDR.jpg', 1290)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (8, N'20130213_212125.jpg', 114)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (9, N'20130407_211341.jpg', 1378)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (10, N'20130824_223508.jpg', 266)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (11, N'20130407_211611.jpg', 96)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (12, N'20160625_024632.jpg', 1257)
INSERT [dbo].[facemash_clone_3] ([id], [name], [score]) VALUES (13, N'20160723_162232.jpg', 1255)
GO
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (1, N'Test1', 1500)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (2, N'Test1', 1500)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (3, N'0406172109b.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (4, N'0718171732a_HDR.jpg', -15)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (5, N'0822171658_HDR.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (6, N'0830171721_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (7, N'1116170509c_HDR.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (8, N'0830171723_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (9, N'1106172345a_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (10, N'20130213_212125.jpg', 1500)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (11, N'20130407_211611.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (12, N'20130407_211341.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (13, N'20130824_223508.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (14, N'20160723_162232.jpg', 31)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (15, N'20160625_024632.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (16, N'0406172109b.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (17, N'0718171732a_HDR.jpg', -15)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (18, N'0830171721_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (19, N'1116170509c_HDR.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (20, N'0822171658_HDR.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (21, N'0830171723_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (22, N'1106172345a_HDR.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (23, N'20130213_212125.jpg', 1500)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (24, N'20130407_211341.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (25, N'20130407_211611.jpg', 16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (26, N'20160723_162232.jpg', 31)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (27, N'20130824_223508.jpg', -16)
INSERT [dbo].[facemash_clone] ([id], [name], [score]) VALUES (28, N'20160625_024632.jpg', -16)
GO
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (1, N'0406172109b.jpg', -32)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (2, N'0718171732a_HDR.jpg', -16)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (3, N'0822171658_HDR.jpg', 0)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (4, N'0830171721_HDR.jpg', 30)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (5, N'0830171723_HDR.jpg', 1500)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (6, N'1106172345a_HDR.jpg', 1500)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (7, N'1116170509c_HDR.jpg', 1500)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (8, N'20130213_212125.jpg', 1500)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (9, N'20130407_211341.jpg', 32)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (10, N'20130407_211611.jpg', 16)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (11, N'20160723_162232.jpg', -30)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (12, N'20130824_223508.jpg', 0)
INSERT [dbo].[facemash_clone_2] ([id], [name], [score]) VALUES (13, N'20160625_024632.jpg', 1500)
GO
INSERT [dbo].[sequenceTable] ([ID], [Title]) VALUES (1, N'Test1')
INSERT [dbo].[sequenceTable] ([ID], [Title]) VALUES (2, N'Test2')
INSERT [dbo].[sequenceTable] ([ID], [Title]) VALUES (3, N'Test3')
INSERT [dbo].[sequenceTable] ([ID], [Title]) VALUES (4, N'Test4')
INSERT [dbo].[sequenceTable] ([ID], [Title]) VALUES (5, N'Test5')
GO
/****** Object:  Index [UQ__identity__15B69B8FAD87803B]    Script Date: 10/24/2020 12:46:49 AM ******/
ALTER TABLE [dbo].[identityTable] ADD UNIQUE NONCLUSTERED 
(
	[GUID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [dbo].[facemash_clone_3] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequencefacemash_clone_3]) FOR [id]
GO
ALTER TABLE [dbo].[facemash_clone] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequenceFacemash_clone]) FOR [id]
GO
ALTER TABLE [dbo].[facemash_clone_2] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequencefacemash_clone_2]) FOR [id]
GO
ALTER TABLE [dbo].[identityTable] ADD  DEFAULT (newid()) FOR [GUID]
GO
ALTER TABLE [dbo].[sequenceTable] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequence]) FOR [ID]
GO
USE [master]
GO
ALTER DATABASE [FUCKHEAD] SET  READ_WRITE 
GO
