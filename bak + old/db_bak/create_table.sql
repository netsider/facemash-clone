USE [FUCKHEAD]
GO

/****** Object:  Table [dbo].[facemash_clone_3]    Script Date: 10/19/2020 5:13:50 AM ******/
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

ALTER TABLE [dbo].[facemash_clone_3] ADD  DEFAULT (NEXT VALUE FOR [dbo].[MySequencefacemash_clone_3]) FOR [id]
GO

