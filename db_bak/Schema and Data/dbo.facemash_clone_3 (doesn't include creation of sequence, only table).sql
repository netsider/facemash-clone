USE [FUCKHEAD]
GO
/****** Object:  Table [dbo].[facemash_clone_3]    Script Date: 10/24/2020 12:52:56 AM ******/
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
ALTER TABLE [dbo].[facemash_clone_3] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequencefacemash_clone_3]) FOR [id]
GO
